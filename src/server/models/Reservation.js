import mongoose from 'mongoose';
import generateSlug  from '../utils/slugify';
import {Room} from './Room';
import moment from 'moment';

var ReservationSchema = new mongoose.Schema({
    slug: {type: String},
    userSlug: {type: String},
    state: {type: String},
    reservedRooms: [{type: mongoose.Schema.ObjectId, ref: 'Room'}],
    user: {type: mongoose.Schema.ObjectId, ref: 'Client'},
    startDate: {type: Date},
    finishDate: {type: Date},
    duration: {type: Number, default: 0},
    createdAt: {type: Date},
    name: {type: String},
    totalAmount: {type: Number, default: 0}
});

class ReservationClass {
    static async add(startDate1, finishDate1, name, userSlug) {
        const slug = await generateSlug(this, name);
        if (!slug) {
            return Promise.reject('Something went wrong');
        }
        let startDate = new Date(startDate1);
        let finishDate = new Date(finishDate1);
        let createdAt = new Date();
        const duration=Math.ceil(moment.duration(moment(finishDate).diff(moment(startDate))).asDays());
        let state = "PROCESSED";
        return this.create({
            slug,
            startDate,
            finishDate,
            createdAt,
            duration,
            name,
            state,
            userSlug
        });
    }


    static async addRoom(roomSlug, reservationSlug) {

        console.log(`somthing is no yes ${roomSlug}    ${reservationSlug}`);
        try {
            let room = await Room.findOne({slug: roomSlug});

            let pricing = room.pricing;
            let reservation = await Reservation.findOne({slug: reservationSlug});
            console.log(reservation)
            let price = pricing.sale*reservation.duration;
            price += reservation.totalAmount;
            reservation.totalAmount = price;
            reservation.reservedRooms=reservation.reservedRooms.concat(room._id);
            await reservation.save();
            room.reservations = room.reservations.concat(reservation._id);
            await room.save();

        } catch (e) {
            return Promise.reject(`Something went wrong ${e}`);
        }

    }

    static async deleteReservation(reservationSlug) {
        try {
            let reservation = await Reservation.findOne({slug: reservationSlug});
            const _id=reservation._id;
            for (const room of reservation.reservedRooms) {
              await Room.update({_id: room},
                    {
                        $pull: {
                            reservations:_id
                        }
                    });
            }
            await reservation.remove();
            return _id;
        } catch (e) {
            return Promise.reject(`Something went wrong ${e}`);
        }
    }

    static async deleteRoomFromReservation(reservationSlug, roomSlug){
        try{
            const room=await Room.findOne({slug: roomSlug});
            const reservation=await Reservation.findOne({slug: reservationSlug});
            console.log(room);
            console.log(reservation)
            room.reservations.splice(room.reservations.indexOf(reservation._id),1)
            reservation.reservedRooms.splice(reservation.reservedRooms.indexOf(room._id), 1);
            await reservation.save();
            await room.save();
        }catch (e) {
            return Promise.reject(e);
        }
    }
    static async changeState(reservationSlug, newState){
        try{
            await Reservation.findOneAndUpdate({slug: reservationSlug}, {
                state: newState
            });

        }catch (e) {
            return Promise.reject(`Cannot change state ${e}`)
        }
    }

}


ReservationSchema.loadClass(ReservationClass);

const Reservation = mongoose.model('Reservation', ReservationSchema);
export {Reservation};