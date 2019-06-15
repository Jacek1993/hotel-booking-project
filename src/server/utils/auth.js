import {Client} from '../models/Client';

const authenticate=(req,res,next)=>{
    let token=req.header('x-auth') || req.body.token || req.query.token || req.cookies.token;
    console.log('token   ',token);
    Client.findByToken(token).then((client)=>{
        if(!client){
            return Promise.reject(`There isn't any client with given token ${token}`)
        }
        console.log(client);
        req.role=client.role;
        req.token=token;
        req.client=client;
        next();
    }).catch((e)=>{
        res.status(401).send(e);
    })
};

export {authenticate};