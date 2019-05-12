import {ObjectID} from 'mongodb';

import {Client} from '../../models/Client';

const clientOneId=new ObjectID();


const clients=[{
    _id: clientOneId,
    firstName: 'Marcin',
    lastName: 'Rybacki',
    email: 'marcinr12@gmail.com',
    password: '12345'
}];


const populateClients=(done)=>{
    Client.remove({}).then(()=>{
        let clientOne=new Client(clients[0]).save();


        return Promise.all([clientOne])
    }).then(()=>done());
};

export {clients, populateClients};