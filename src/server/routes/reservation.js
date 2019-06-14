import express from 'express';


const router = express.Router();
import {Reservation} from '../models/Reservation';
import {Room} from '../models/Room';
import {authenticate} from '../utils/auth';


router.post('/', authenticate, async (req, res) => {
    try {
        console.log(req.body);
        let client = req.client;
        let startDate = req.body.startDate;
        let finishDate = req.body.finishDate;
        let userSlug=req.client.slug;
        let name = client.firstName.concat(' ', client.lastName);
        const reservation = await Reservation.add(startDate, finishDate, name, userSlug);
        console.log('reservation ', reservation);
        let slug = reservation.slug;
        let rooms = reservation.getRooms();
        client.reservation = client.reservation.concat({slug, startDate, finishDate, rooms});
        await client.save();
        res.status(200).send(reservation);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/make', authenticate, async (req, res) => {
    try {
        let role = req.role;
        if (role === "admin") {
            console.log(req.body);
            const reservation = await Reservation.filterRoomsToMakeReservation(req.body);
            res.status(200).send(reservation);
        }
        else {
            res.status(401).send(`Sorry You have to have administrator privileges`)
        }
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/rooms', async (req, res) => {
    try {
        console.log(req.query.startDate);
        let starDate = req.query.startDate;
        let finishDate = req.query.finishDate;
        let personAmount = req.query.personAmount;
        console.log(`startDate ${starDate} finishDate ${finishDate} personAmount ${personAmount}`);
        let rooms = await Room.findRoom({startDate: starDate, finishDate: finishDate, personAmount: personAmount});
        res.status(200).send(rooms);
    } catch (e) {
        console.log(e);
    }
});

router.put('/room/add', authenticate, async (req, res) => {
    try {
        console.log(`request ${req.body.roomSlug} ${req.body.reservationSlug}`);
        let roomSlug = req.body.roomSlug;
        let reservationSlug = req.body.reservationSlug;
        let client = req.client;
        await Reservation.addRoom(roomSlug, reservationSlug);
        console.log('before client update');
        client.reservation.forEach((res) => {
            if (res.slug === reservationSlug) {
                console.log(res.slug);
                console.log('roomSlug ', roomSlug);
                res.rooms.push(roomSlug);
                console.log('rooms', res.rooms);
            }
        });

        console.log(client.reservation);

        console.log('after client update');
        await client.save();


        res.status(200).send('OK');
    } catch (e) {
        res.status(400).send(e)
    }
});


router.delete('/purge', authenticate, async (req, res) => {
    try {
        console.log(req.query);
        let reservationSlug = req.query.reservationSlug;
        let client = req.client;
        await Reservation.deleteReservation(reservationSlug);
        await client.update({
            $pull: {
                reservation: {
                    slug: reservationSlug
                }
            }
        });
        res.status(200).send('OK');
    } catch (e) {
        res.status(400).send(e);
    }
});

router.put('/change', authenticate, async (req, res) => {
    try {
        let reservationSlug = req.body.reservationSlug;
        await Reservation.changeStateAuthorizationToBooked(reservationSlug);
        res.status(200).send('OK');
    } catch (e) {
        res.status(400).send(e);
    }
});

//ten request jest niezabiespieczony w sensie jesli chcemy go otworzyc w przegladarce nie mozemy dac autentykacji
router.get('/:slug', async (req, res) => {

    console.log(req.params.slug);
    try {
        let slug = req.params.slug;
        let reservation = await Reservation.findOne({slug: slug});
        res.status(200).send(reservation)
    } catch (e) {
        res.status(400).send(`Bad credentials reservation with slug: ${req.params.slug} doesn't exsits`);
    }

});



export default router;