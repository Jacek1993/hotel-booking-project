import express from 'express';
const router = express.Router();
import {Opinion} from '../models/Opinion';
import {Room} from '../models/Room'
import {Client} from '../models/Client'
import {authenticate} from "../utils/auth";


router.post('/',authenticate, async (req,res)=>{
    try{
        const title=req.body.title;
        const description=req.body.description;
        const rating=req.body.rating;
        const roomSlug=req.query.roomSlug;
    let opinion=await Opinion.add({
        title: title,
        description: description,
        rating: rating,
        owner: req.client._id
    });
    console.log(opinion)
    await Room.addOpinion(roomSlug, opinion._id);
    await Client.update({slug: req.client.slug}, {$push: {opinions: opinion._id}});
    res.status(200).send(opinion);
    }catch (e) {
        res.status(400).json({
            error: e
        })
    }

});

router.put('/add',authenticate, async(req, res)=>{
    try{
        const opinionId=req.query.opinionId;
        const votersId=req.query.votersId;
        let opinion=Opinion.addVote({opinionId, votersId });
        res.status(200).send(opinion)
    }catch (e) {
    res.status(400).json({
        error: e
    })
    }
});

export default router;