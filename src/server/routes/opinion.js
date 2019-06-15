import express from 'express';
const router = express.Router();
import {Opinion} from '../models/Opinion';
import {logger} from '../logs/logger';
import {authenticate} from "../utils/auth";


router.post('/',authenticate, async (req,res)=>{
    try{
        const title=req.body.title;
        const description=req.body.description;
        const rating=req.body.rating;
    let opinion=await Opinion.add({
        title: title,
        description: description,
        rating: rating,
        owner: req.client._id
    });
    res.status(200).send(opinion);
    }catch (e) {
        res.status(400).send(e);
    }

});

router.put('/add',authenticate, async(req, res)=>{
    try{
        const opinionId=req.query.opinionId;
        const votersId=req.query.votersId;
        let opinion=Opinion.addVote({opinionId, votersId });
        res.status(200).send(opinion)
    }catch (e) {
    res.status(400).send(e);
    }
});

export default router;