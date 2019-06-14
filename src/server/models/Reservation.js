import mongoose from 'mongoose';
import generateSlug  from '../utils/slugify';
import {Room} from './Room';

var ReservationSchema = new mongoose.Schema({
    slug: {type: String},
    userSlug: {type: String},
    state: {type: String},
    reservedRooms: [{
        slug: {type: String},
        roomNumber: {type: String},
        personAmount: {type: Number},
        pricing: {
            retail: {type: Number},              //moze byc w sumie tez enum bo tylko jedna z kilku wartosci bedzie obowaizaywac
            sale: {type: Number}
        }
    }],
    startDate: {type: Date},
    finishDate: {type: Date},
    createdAt: {type: Date},
    name: {type: String},
    totalAmount: {type: Number, default: 0}
});

class ReservationClass {
    static async add(startDate1, finishDate1, name, userSlug) {
        console.log('Reservation add weszlo');
        const slug = await generateSlug(this, name);
        console.log('generating slug', slug);
        if (!slug) {
            return Promise.reject('Something went wrong');
        }

        console.log('this is after if in REservation Class');
        let startDate = new Date(startDate1);
        let finishDate = new Date(finishDate1);
        let createdAt = new Date();
        let state = "PROCESSED";
        return this.create({
            slug,
            startDate,
            finishDate,
            createdAt,
            name,
            state,
            userSlug
        });
    }

//todo ten pomysl nie wypali bo nie mozna operaowac na tablicy tablic i na bazie danych jendoczesnie
    static async filterRoomsToMakeReservation(filter) {
        try {
            let arrayOfRooms = [];

            for (const room of filter.rooms) {
                console.log('START In FOR LOOP');
                let tempRooms = await Room.findRoom({
                    startDate: room.startDate,
                    finishDate: room.finishDate,
                    personAmount: room.personAmount
                });

                if (tempRooms.length === 0) {

                    return Promise.reject(`There is no such room with given credentials: start date: ${room.startDate} finish data: ${room.finishDate} person amount: ${room.personAmount}`);
                }
                arrayOfRooms.push(tempRooms);
            }
            return Promise.resolve(arrayOfRooms);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    //we don't have to add start/finishDate because we added them at the beginning when Reservation is created
    //todo ponizsza funkcje wywolac w konstrollerze przed funkcja addRoom()
    // let rooms=Room.findRoom({startDate: reservation.startDate, finishDate: reservation.finishDate, personAmount: personAmount});

    static async addRoom(roomSlug, reservationSlug) {
        let reserv = this;
        console.log('In Add room Function');
        try {
            let room = await Room.findOne({slug: roomSlug});

            let pricing = room.pricing;
//Reservation is updated regarding room credentials
            let reservation = await reserv.findOneAndUpdate({slug: reservationSlug}, {
                $push: {
                    reservedRooms: {
                        slug: room.slug,
                        roomNumber: room.roomNumber,
                        personAmount: room.personAmount,
                        pricing: pricing
                    }
                }
            });
            let price = pricing.sale;
            await reserv.findOne({slug: reservationSlug});
            price += reservation.totalAmount;
            console.info('price', price);
            reservation.totalAmount = price;
            await reservation.save();

            room.reservation = room.reservation.concat({
                slug: reservation.slug, name: reservation.name, startDate: reservation.startDate,
                finishDate: reservation.finishDate, state: "IN_CART", creationTime: reservation.createdAt
            });

            await room.save();

            // console.log('room after operations ', room );
        } catch (e) {
            return Promise.reject(`Something went wrong ${e}`);
        }

    }

    static async deleteReservation(reservationSlug) {
        try {
            let reservation = await Reservation.findOne({slug: reservationSlug});
            console.log(reservation);
            let reservedRoom = reservation.reservedRooms;

            for (const room of reservedRoom) {
                let room1 = await Room.update({slug: room.slug},
                    {
                        $pull: {
                            reservation: {
                                slug: reservationSlug
                            }
                        }
                    });
                console.log('room after delete operation ', room1);
            }

            reservation.remove();

        } catch (e) {
            return Promise.reject(`Something went wrong ${e}`);
        }
    }

    static async changeStateInCartToAuthorization(reservationSlug) {
        try {
            await Reservation.findOneAndUpdate({slug: reservationSlug},
                {$set: {state: "AUTHORIZATION"}});

        } catch (e) {
            return Promise.reject(`cannot change state of reservation ${e}`)
        }
    }

    static async changeStateAuthorizationToBooked(reservationSlug) {
        try {
            let reservation = await Reservation.findOneAndUpdate({slug: reservationSlug},
                {
                    $set: {state: "BOOKED"}
                });
            console.log('reservation ', reservation.reservedRooms);
            for (const room of reservation.reservedRooms) {           //jest dobrze poniewaz pokuj nie moze miec dwóch takich samych reserwacji
                let room1 = await Room.findOneAndUpdate({slug: room.slug, "reservation.slug": reservationSlug},
                    {
                        $set: {"reservation.$.state": "BOOKED"}
                    });
                console.log(room1.reservation)
            }
            console.log('before for loop');
        } catch (e) {
            return Promise.reject(`Cannot change state of reservation to Booked ${e}`);
        }
    }

    static async changeStateFromAuthorizationToInCart(reservationSlug) {
        try {
            await Reservation.findOneAndUpdate({slug: reservationSlug},
                {$set: {state: "IN_CART"}});

        } catch (e) {
            return Promise.reject(`cannot change state of reservation ${e}`)
        }
    }

    static async changeStateFromAuthorizationToNone(reservationSlug) {
        try {
            let reservation = await Reservation.findOne({slug: reservationSlug});

            console.log('reservation ', reservation.reservedRooms);
            for (const room of reservation.reservedRooms) {           //jest dobrze poniewaz pokoj nie moze miec dwóch takich samych reserwacji
                let room1 = await Room.findOneAndUpdate({slug: room.slug, "reservation.slug": reservationSlug},
                    {
                        $set: {"reservation.$.state": ""}
                    });
                console.log(room1.reservation)
            }
            console.log('before for loop');
            await reservation.remove();
        } catch (e) {
            return Promise.reject(`Cannot change state of reservation to Booked ${e}`);
        }
    }

    getRooms() {
        let reservation = this;
        let rooms = [];
        reservation.reservedRooms.forEach((room) => {
            rooms.append(room.slug);
        });
        return rooms;
    }


}

ReservationSchema.loadClass(ReservationClass);

const Reservation = mongoose.model('Reservation', ReservationSchema);
export {Reservation};