import mongoose from 'mongoose';
import _ from 'lodash';
import {Opinion} from './Opinion'


const RoomSchema = new mongoose.Schema({
    slug: {type: String},
    roomNumber: {type: String},
    description: [{type: String}],
    personAmount: {type: Number},
    pricing: {
        retail: {type: Number},
        sale: {type: Number}
    },
    picture: [{type: String}],
    reservations: [{type: mongoose.Schema.ObjectId, ref: 'Reservation'}],
    opinions: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Opinion'
    }],
    totalRating: {type: Number, default: 0},
    rating: {type: Number, default : 0},
    tags: {type: String}
});

class RoomClass {


    static async add({roomNumber, description, pricing, personAmount, tags}) {

        let room = await this.findOne({roomNumber});
        if (room) {
            return Promise.reject('room exists');
        }

        const  slug = _.kebabCase('room' + roomNumber);
        if (!slug) {
            return Promise.reject(`Error with slug generation for name: ${roomNumber}`);
        }
        return this.create({
            roomNumber,
            slug,
            personAmount,
            description,
            pricing,
            tags
        });
    }

    static async findRoom({startDate, finishDate, personAmount}) {

        try {
            return  await Room.aggregate([{
                $lookup: {
                    from: 'reservations',
                    localField: 'reservations',
                    foreignField: '_id',
                    as: 'reservation_table'
                }
            },
                {
                    $match: {
                        "reservation_table": {
                            "$not": {
                                "$elemMatch":
                                    {
                                        "$or": [{
                                            "$and": [{startDate: {"$gte": new Date(startDate)}},
                                                {startDate: {"$lte": new Date(startDate)}}]
                                        }, {
                                            "$and": [{startDate: {"$lte": new Date(startDate)}},
                                                {startDate: {"$lte": new Date(startDate)}},
                                                {finishDate: {"$gte":  new Date(finishDate)}},
                                                {finishDate: {"$gte": new Date(finishDate)}}]
                                        },

                                            {
                                                "$and": [{finishDate: {"$gte": new Date(finishDate)}},
                                                    {finishDate: {"$lte":  new Date(finishDate)}}]
                                            },
                                            {
                                                "$and": [{state: {"$eq": "IN_CART"}},
                                                    {state: {"$eq": "BOOKED"}}]
                                            }]
                                    }
                            }
                        },
                        "personAmount": personAmount
                    }
                }])
        } catch (e) {
            console.log(e)
            return Promise.reject(`There is some error ${e}`);
        }


    }


    static async findRoomWithReservationAll(undo, startDate, slug) {
        return await Room.aggregate([{
            $lookup: {
                from: 'reservations',
                localField: 'reservations',
                foreignField: '_id',
                as: 'reservation_table'
            }
        },
            {
                $match: {
                    slug: undo
                }
            },
            {
                $project: {
                    description: {$cond: [{$ne: ['$slug', slug]}, '$description', '$$REMOVE']},
                    roomNumber: {$cond: [{$ne: ['$slug', slug]}, '$roomNumber', '$$REMOVE']},
                    slug: {$cond: [{$ne: ['$slug', slug]}, '$slug', '$$REMOVE']},
                    pricing: {$cond: [{$ne: ['$slug', slug]}, '$pricing', '$$REMOVE']},
                    picture: {$cond: [{$ne: ['$slug', slug]}, '$picture', '$$REMOVE']},

                    reservation_table: {
                        $filter: {
                            input: "$reservation_table",
                            cond: {$gte: ["$$this.startDate", new Date(startDate)]}
                        }
                    }
                }

            }
        ]);
    }


    static async addOpinion(roomSlug, opinionId) {
        try {
            const room = await Room.findOneAndUpdate({slug: roomSlug}, {$push: {opinions: opinionId}}, {new: true});
            console.log(room)
            const opinion = await Opinion.findOne({_id: opinionId});
            console.log(opinion)
            room.totalRating = opinion.rating;
            room.rating = room.totalRating / room.opinions.length;
            await room.save();
            console.log(room);
        }catch(e){
            return Promise.reject(`Some errors occurred: ${e}`);
        }

    }
}

RoomSchema.pre('remove', function (next) {

    this.model('Reservation').remove({reservedRoom: this._id}, next);
    this.model('Opinion').remove({_id: {$in: this.opinions}}, next);

})

RoomSchema.loadClass(RoomClass);
const Room = mongoose.model('Room', RoomSchema);
export {Room};