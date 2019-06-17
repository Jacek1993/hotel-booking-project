import express from 'express';

const router = express.Router();
import {Opinion} from '../models/Opinion';
import {Room} from '../models/Room'
import {Client} from '../models/Client'
import {authenticate} from "../utils/auth";
import {check, validationResult} from 'express-validator/check'


router.post('/',[check('title').not().isEmpty(), check('description').not().isEmpty(), check('rating').isNumeric()], authenticate, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array().map(e=>e.param+' '+e.msg).reduce((init, e)=>init+=e, '') });
    }
    try {
        const title = req.body.title;
        const description = req.body.description;
        const rating = req.body.rating;
        const roomSlug = req.query.roomSlug;
        let opinion = await Opinion.add({
            title: title,
            description: description,
            rating: rating,
            owner: req.client._id
        });
        console.log(opinion)
        await Room.addOpinion(roomSlug, opinion._id);
        await Client.update({slug: req.client.slug}, {$push: {opinions: opinion._id}});
        res.status(200).send(opinion);
    } catch (e) {
        res.status(400).json({
            error: e
        })
    }

});

router.put('/add', authenticate, async (req, res) => {
    try {
        const opinionId = req.query.opinionId;
        const votersId = req.query.votersId;
        let opinion = Opinion.addVote({opinionId, votersId});
        res.status(200).send(opinion)
    } catch (e) {
        res.status(400).json({
            error: e
        })
    }
});

router.delete('/', authenticate, async (req, res) => {
    try {
        if (req.role === 'admin') {
            const opinionId = req.query.opinionId;
            const roomSlug=req.query.roomSlug;
            await Opinion.deleteOpinion(opinionId, roomSlug, req.client.slug);
        }
        else {
            res.status(401).json({
                error: `You are not authorized`
            })
        }
    }
    catch (e) {
        res.status(400).json({
            error: e
        })
    }
})

export default router;