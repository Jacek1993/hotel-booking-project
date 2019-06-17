import express from 'express';


const router = express.Router();
import {Reservation} from '../models/Reservation';
import {authenticate} from '../utils/auth';
import email from '../email/config';
import {Client} from '../models/Client'



router.post('/',authenticate, async (req, res) => {
    console.log('post reservation')
    try {
        console.log(req.body);
        let client = req.client;
        let startDate = req.body.startDate;
        let finishDate = req.body.finishDate;
        let userSlug=req.client.slug;
        let name = client.firstName.concat(' ', client.lastName);
        const reservation = await Reservation.add(startDate, finishDate, name, userSlug);
        console.log('reservation ', reservation);
        client.reservation = client.reservation.concat(reservation._id);
        await client.save();
        reservation.user=client._id;
        await reservation.save();
        res.status(200).send(reservation);
    } catch (e) {
        res.status(400).json({
            error: e
        })
    }
});


router.put('/room/add', authenticate, async (req, res) => {
    try {
        console.log(`request ${req.body.roomSlug} ${req.body.reservationSlug}`);
        let roomSlug = req.body.roomSlug;
        let reservationSlug = req.body.reservationSlug;
        await Reservation.addRoom(roomSlug, reservationSlug);

        res.status(200).send('OK');
    } catch (e) {
        res.status(400).json({
            error: e
        })
    }
});


router.delete('/purge', authenticate, async (req, res) => {
    try {
        console.log(req.query);
        let reservationSlug = req.query.reservationSlug;
        let client = req.client;
        if(req.headers.owner){
            client=await Client.findOne({slug: req.headers.owner});
            const credentials={
                userName: client.userName,
                employer: req.query.client.userName
            }
            await email('reservationRemoval', credentials, client.email);
        }
        const _id=await Reservation.deleteReservation(reservationSlug);
        await client.update({
            $pull: {
                reservation:  _id
            }
        });
        res.status(200).send('OK');
    } catch (e) {
        res.status(400).json({
            error: e
        })
    }
});

router.delete('/',authenticate, async(req,res)=>{
    try{
        const roomSlug=req.query.roomSlug;
        const reservationSlug=req.query.reservationSlug;
        await Reservation.deleteRoomFromReservation(reservationSlug, roomSlug);
        res.status(200).send('OK')
    }catch (e) {
        res.status(400).json({
            error: e
        })
    }
})

router.put('/change', authenticate, async (req, res) => {
    try {
        let reservationSlug = req.query.reservationSlug;
        let newState=req.query.newState;
        await Reservation.changeState(reservationSlug, newState);
        res.status(200).send('OK');
    } catch (e) {
        res.status(400).json({
            error: e
        })
    }
});

//ten request jest niezabiespieczony w sensie jesli chcemy go otworzyc w przegladarce nie mozemy dac autentykacji
router.get('/:slug', authenticate, async (req, res) => {

    console.log(req.params.slug);
    try {
        let slug = req.params.slug;
        let reservation = await Reservation.findOne({slug: slug}).populate('reservedRooms').exec();
        res.status(200).send(reservation)
    } catch (e) {
        res.status(400).json({
            error: `Bad credentials reservation with slug: ${req.params.slug} doesn't exsits`
        });
    }

});



export default router;