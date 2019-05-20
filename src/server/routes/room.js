import express from 'express';
import {ObjectId} from 'mongodb';
import multer from 'multer';
import sharp from 'sharp'

const router = express.Router();
import {Room} from '../models/Room';
import {logger} from '../logs/logger';
import {authenticate} from '../utils/auth';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${process.cwd()}/src/img`);
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

//creating Room
router.post('/', authenticate, async (req, res) => {
    try {
        if (req.role === "admin") {
            console.log(req.body);
            const room = await Room.add({
                roomNumber: req.body.roomNumber,
                description: req.body.description,
                pricing: req.body.pricing,
                personAmount: req.body.personAmount
            });
            res.status(200).send(room);
        }
        else {
            res.status(401).send(`Sorry You don't have privileges`)
        }
    } catch (e) {
        res.status(400).send(e);
    }
});


router.put('/image/:roomNumber', authenticate, upload.single('productImage'), async (req, res, next) => {

    try {
        if (req.role === 'admin') {
            let roomNumber = req.params.roomNumber.toString();
            console.log('Room ID number', roomNumber);
            let room = await Room.findOne({roomNumber});
            room.picture.push(req.file.path);
            room.save();
            res.status(200).send('Image uploaded');
        }
        else {
            res.status(401).send(`Sorry You don't have privileges`)
        }
    } catch (e) {
        console.log('Cannot upload image');
        res.status(400).json({
            error: e
        });
    }
});

router.get('/isAvailable/:roomNumber', authenticate, async (req, res, next) => {
    try {
        let roomNumber = req.params.roomNumber.toString();
        console.log('Room ID number', roomNumber);
        let startDate = req.body.startDate;
        let finishDate = req.body.finishDate;
        let room = await Room.isAvailableRoom({roomNumber: roomNumber, startDate: startDate, finishDate: finishDate});
        if (room) {
            console.log('Room is available', room);
            res.status(200).send('Room is available');
        } else {
            res.status(400).send('Room is unavailable');
        }
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/rooms', authenticate, async (req, res, next) => {
    try {
        let starDate = req.body.startDate;
        let finishDate = req.body.finishDate;
        let personAmount = req.body.personAmount;
        let rooms = await Room.findRoom({startDate: starDate, finishDate: finishDate, personAmount: personAmount});
        res.status(200).send(rooms);
    } catch (e) {
        console.log(e);
    }
});


router.delete('/:roomNumber/reservation/:id', authenticate, async (req, res) => {
    try {
        console.log(req.params.roomNumber + "     " + req.params.id);
        let room = await Room.removeReservation(req.params.roomNumber, req.params.id);
        res.status(200).send(room);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/all', authenticate, async(req, res)=>{
    try {
        if (req.role === 'admin') {
            let rooms = await Room.find({}).select('roomNumber slug pricing picture personAmount description').exec();
            res.status(200).send(rooms);
        }
        else {
            res.stat(401).json({
                error: 'You are not authenticated'
            })
        }
    }catch (e) {
        res.status(400).json({
            error: e
        })
    }
})

router.get('/:slug', authenticate, async(req, res)=>{
    try{
        let room=await Room.find({slug: req.params.slug});
        res.status(200).send(room);
    }catch(e){
        res.status(400).json({
            error: e
        })
    }
})

router.get('/', (req, res) => {
    res.send({
        success: 'udalo sie w koncu'
    });
});


export default router;