import  mongoose from 'mongoose';
import {Room} from './Room'
import {Client} from './Client'


const OpinionSchema = new mongoose.Schema({
    date: {type: Date, default: Date.now},
    title: {type: String},
    description: {type: String},
    rating: {type: Number},
    owner: {type:mongoose.Schema.Types.ObjectId, ref: 'Client'},
    helpfulVotes: {type: Number, default: 0},
    votersId: [{type: mongoose.Schema.Types.ObjectId, ref: 'Client' }]
});

class OpinionClass {
    static async add({title, description, rating, owner}) {
        console.log(`${title} hello`);

        return await this.create({ title, description, rating, owner});

    }

    static async addVote({opinionId, votersId}) {
        try {
            await Opinion.update({_id: opinionId}, {
                $inc: {helpfulVotes: 1},
                $push: {votersId: votersId}
            })

        }catch (e) {
            return Promise.reject(e);
        }
    }

    static async deleteOpinion(opinionId, roomSlug, clientSlug){
        try{
            await Room.update({slug: roomSlug}, {
                $pull:{
                    opinions: opinionId
                }
            });
            await Client.update({slug: clientSlug}, {
                $pull:{
                    opinions: opinionId
                }
            })
        }catch(e){
            return Promise.reject(e)
        }
    }

};

OpinionSchema.loadClass(OpinionClass);
let Opinion = mongoose.model('Opinion', OpinionSchema);
export {Opinion};