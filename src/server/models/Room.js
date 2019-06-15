import mongoose from 'mongoose';
import _ from 'lodash';



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
    reservation: [{type: mongoose.Schema.ObjectId, ref: 'Reservation'}],
    opinions: [{
        type: mongoose.Schema.Types.ObjectId,
        title: {type: String},
        rating: {type: Number},
    }],
    tags: {type: String}
});

class RoomClass {


    static async add({roomNumber, description, pricing, personAmount, tags}) {

        let room = await this.findOne({roomNumber});
        if (room) {
            console.log('room exists');
            return Promise.reject('room exists');
        }

        var slug = _.kebabCase('room' + roomNumber);
        console.log('slug', slug);
        if (!slug) {
            console.info('slug error');
            return Promise.reject(`Error with slug generation for name: ${roomNumber}`);
        }
        let startDate = new Date();
        let finishDate = new Date();
        return this.create({
            roomNumber,
            slug,
            personAmount,
            description,
            pricing,
            tags,
            reservation: {
                startDate,
                finishDate
            }
        });
    }

//todo sprawdzic czy dziala poprawnie ta metoda
    async isAvailableRoom({state = 'AVAILABLE'}) {
        console.log('isAvailableRoom function Room Schema ');
        let room = await this.findOne({"reservation": {state: state}});

        console.log(room);
        if (!rooms) return Promise.reject(false);
        return Promise.resolve(true);
    }


    static async findRoom({startDate, finishDate, personAmount}) {
        console.log('In findRoom method \n');
        var rooms = await this.find({
            "reservation": {
                "$not": {
                    "$elemMatch":
                        {
                            "$or": [{
                                "$and": [{startDate: {"$gte": new Date(startDate)}},
                                    {startDate: {"$lte": new Date(finishDate)}}]
                            }, {
                                "$and": [{startDate: {"$lte": new Date(startDate)}},
                                    {startDate: {"$lte": new Date(finishDate)}},
                                    {finishDate: {"$gte": new Date(startDate)}},
                                    {finishDate: {"$gte": new Date(finishDate)}}]
                            },

                                {
                                    "$and": [{finishDate: {"$gte": new Date(startDate)}},
                                        {finishDate: {"$lte": new Date(finishDate)}}]
                                },
                                {
                                    "$and": [{state: {"$eq": "IN_CART"}},
                                        {state: {"$eq": "BOOKED"}}]
                                }]
                        }
                }
            }, "personAmount": personAmount
        });

        console.log(rooms);
        if (!rooms) return Promise.reject(`There is no such records with credentials: startDate: ${startDate}, finishDate: ${finishDate}, personAmount: ${personAmount}`);
        return Promise.resolve(rooms);
    }

    async processForward({reservation_id, old_state, new_state}) {

        await this.reservation.findAndModify({
            query: {
                reservation_id: reservation_id,
                old_state: old_state
            },
            update: {
                '$set': {
                    state: new_state
                }
            }
        });
    }



    async addReservation(reservation) {
        let room = this;
        try {
            room.reservation = await room.reservation.concat({reservation});
            await room.save();
        } catch (e) {
            throw Error(`Cannot add reservation `);
        }
    }

    async removeRerservation(slug) {
        let room = this;
        try {
            await room.update({
                $pull: {
                    reservation: {
                        slug: slug
                    }
                }
            });

        } catch (e) {
            throw Error(`cannot remove reservation with given slug: ${slug}`)
        }
    }

    async changeStateInCartToBooked(slug) {
        let room = this;
        await room.reservation.update({slug: slug}, {state: "BOOKED"});
    }

    async changeStateFromBookedToInCart(slug) {
        let room = this;
        await room.reservation.update({slug: slug}, {state: "IN_CART"});
    }

    async changeStateFromInCartToNone(slug) {
        let room = this;
        await room.reservation.update({slug: slug}, {state: ""});
    }

    async addOpinon({opinion}) {
        let room = this;
        try {
            room.opinions = await room.opinions.concat({opinion});
            await room.save();
        } catch (e) {
            throw Error(`Cannot add opinion `);
        }
    }

    static async findRoomWithReservationAll(undo, startDate, slug) {
        return await Room.aggregate([{
            $lookup: {
                from: 'reservations',
                localField: 'reservation.slug',
                foreignField: 'slug',
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
                    roomNumber: {$cond: [{$ne: ['$slug',  slug]}, '$roomNumber', '$$REMOVE']},
                    slug: {$cond: [{$ne: ['$slug',  slug]}, '$slug', '$$REMOVE']},
                    pricing: {$cond: [{$ne: ['$slug',  slug]}, '$pricing', '$$REMOVE']},
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
}

RoomSchema.pre('remove', function(next){
    this.model('Reservation').remove({reservedRoom: this._id}, next);
})

RoomSchema.loadClass(RoomClass);
const Room = mongoose.model('Room', RoomSchema);
export {Room};