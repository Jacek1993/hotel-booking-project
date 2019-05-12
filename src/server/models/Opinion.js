import  mongoose from 'mongoose';
import  _ from 'lodash';
import  {logger} from '../logs/logger';

const OpinionSchema = new mongoose.Schema({
    opinionId: {type: mongoose.Schema.Types.ObjectId},
    date: {type: Date},
    title: {type: String},
    description: {type: String},
    rating: {type: Number},
    clientSlug: {type: String},
    username: {type: String},
    helpfulVotes: {type: Number},
    votersId: [{type: String}]
});

class OpinionClass {
    static async add({title, description, rating, clientSlug, username}) {
        let date = new Date();
        console.log(`${title} hello`);

        let opinion = await this.create({date, title, description, rating, clientSlug, username});
        console.log(opinion);

        return opinion.update({opinionId: opinion._id});
    }

    static async addVote({opinionId, votersId}) {
        await Opinion.findOneAndUpdate({opinionId: opinionId}, {
            $inc: {helpfulVotes: 1},
            $push: {votersId: votersId}
        })
    }

};

OpinionSchema.loadClass(OpinionClass);
let Opinion = mongoose.model('Opinion', OpinionSchema);
export {Opinion};