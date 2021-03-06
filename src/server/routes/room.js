import express from 'express';
import multer from 'multer';
import {config} from '../../config/serverConfig';
import fs from 'fs'
import {check, validationResult} from 'express-validator/check'


const router = express.Router();
import {Room} from '../models/Room';
import {authenticate} from '../utils/auth';
import errorHandler from "../db/dbErrorHandler";

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
router.post('/', authenticate,[check('roomNumber').isNumeric(), check('description').not().isEmpty(), check('pricing.retail').isNumeric(), check('pricing.sale').isNumeric(), check('personAmount').isNumeric(), check('tags').not().isEmpty()], async (req, res) => {
    console.log(req.body.roomNumber + 'This is our body')
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array().map(e=>e.param+' '+e.msg).reduce((init, e)=>init+=e, '') });
    }
    try {
        if (req.role === "admin") {
            console.log('CREATING ROOM')
            console.log(req.body);
            const room = await Room.add({
                roomNumber: req.body.roomNumber,
                description: req.body.description,
                pricing: req.body.pricing,
                personAmount: req.body.personAmount,
                tags: req.body.tags
            });
            res.status(200).send(room);
        }
        else {
            res.status(401).json({
                error: `Sorry You don't have privileges`
            })
        }
    } catch (e) {
        res.status(400).json({
            error: e
        });
    }
});


router.post('/image/:slug', authenticate, upload.array('productImage'), async (req, res, next) => {

    try {
        if (req.role === 'admin') {
            console.log('INT THE IMAGE UPLOAD')
            let room = await Room.findOne({slug: req.params.slug});
            console.log(room);
            console.log('FURETEHER PART OF TASK')
            console.log(req.files);
            req.files.forEach((file) => room.picture.push(file.filename));
            room.save();
            res.status(200).json({
                message: 'Image uploaded'
            });
        }
        else {
            res.status(401).json({
                error: `Sorry You don't have privileges`
            })
        }
    } catch (e) {

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
        let room = await Room.isAvailableRoom({roomNumber,  startDate, finishDate});
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

router.get('/rooms', async (req, res, next) => {
    try {
        let starDate = req.query.startDate;
        let finishDate = req.query.finishDate;
        let personAmount = req.query.personAmount;
        let rooms = await Room.findRoom({startDate: starDate, finishDate: finishDate, personAmount: personAmount});
        res.status(200).send(rooms);
    } catch (e) {
        res.status(400).json({
            error: e
        })
    }
});


router.get('/all' , async (req, res) => {
    try {

            let rooms = await Room.find({}).select('roomNumber slug pricing picture personAmount description').exec();
            res.status(200).send(rooms);

    } catch (e) {
        res.status(400).json({
            error: e
        })
    }
})

router.get('/view/:slug',  async (req, res) => {
    try {
        console.log(req.params.slug)
        let room = await Room.findOne({slug: req.params.slug}).select('roomNumber slug pricing picture personAmount description').exec();
        res.status(200).send(room);
    } catch (e) {
        res.status(400).json({
            error: e
        })
    }
})

router.delete('/:slug', authenticate, async (req, res) => {
    try {
        if (req.role === 'admin') {
            const room = await Room.findOne({slug: req.params.slug});
            room.picture.forEach((picture) => {
                fs.unlink(`${config.uploadedFilePath}/${picture}`, (err) => {
                    if (err) {
                        throw err;
                    }
                })
            });
            await room.remove();
            res.status(200).json({
                message: 'OK'
            });
        }
        else {
            res.status(401).json({
                error: 'Sorry you are not authorized to do that'
            })
        }
    } catch (e) {
        res.status(400).json({
            error: e
        })
    }
})

router.get('/:slug/reservation/:startDate', authenticate, async (req, res) => {
    try {
        const undo = req.headers.undo ? req.headers.undo : '';
        let room = await Room.findRoomWithReservationAll(req.params.slug, req.params.startDate, undo);
        res.status(200).send(room);
    } catch (e) {
        res.status(400).json({
            error: e
        })
    }

});

router.post('/update/:slug',[ check('description').not().isEmpty(), check('pricing').contains('retail').contains('sale'), check('tags').not().isEmpty()], authenticate, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array().map(e=>e.param+' '+e.msg).reduce((init, e)=>init+=e, '') });
    }
    try {
        if (req.role === 'admin') {
            const room = await Room.findOne({slug: req.params.slug});
            room.description = req.body.description;
            room.pricing = req.body.pricing;
            room.tags=req.body.tags;
            let toDelete = [];
            req.body.picture.forEach((picture) => {
                if(!room.picture.includes(picture))
                toDelete.push(picture);
            })
            room.picture = req.body.picture;
            if (toDelete.length > 0) {
                toDelete.forEach((picture) => {
                    fs.unlink(`${config.uploadedFilePath}/${picture}`, (err) => {
                        if (err) {
                            throw err;
                        }
                    })
                });
            }
            await room.save();
            res.status(200).json({
                message: 'OK'
            })

        } else {
            res.status(401).json({
                error: 'You have to have admin privileges'
            })
        }
    }
    catch (e) {
        res.status(400).json({
            error: e
        })
    }
})
//todo zmienic url oraz dodac async await zamiast tej implementacji
router.get('/',(req, res)=>{
    let tags={};
    if(req.query.search){
        tags={'$regex' : req.query.search, '$options': "i"};
    }
    else{
        let temp=[];
        res.status(200).send(temp)
    }

        Room.find({tags},(err,response)=>{
            if(err){
                res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                })
            }
            res.json(response)
        }).select('roomNumber slug pricing picture personAmount description');

})


export default router;