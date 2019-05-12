import express from 'express';
const router = express.Router();
import {Opinion} from '../models/Opinion';
import {logger} from '../logs/logger';


router.post('/', async (req,res)=>{


    try{
    let opinion=await Opinion.add({
        title: 'opinion',
        description: 'description opinion',
        rating: 2.0,
        clientSlug: 'czarny1992',
        username: 'wampire'
    });
    console.log('hello');
    res.status(200).send(opinion);
    }catch (e) {
        res.status(400).send(e);
    }

});

router.put('/add', async(req, res)=>{
    try{
        let opinion=Opinion.addVote({opinionId: '5cb4a3b94e490a531a2ac570', votersId: 'czarny' });
        res.status(200).send(opinion)
    }catch (e) {
    res.status(400).send(e);
    }
});

export default router;