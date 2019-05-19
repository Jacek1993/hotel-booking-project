import express from 'express';
import {ObjectId} from 'mongodb';
import {deleteFile} from '../db/mongoose';
import '../config/config';
import {body, buildCheckFunction, validationResult} from 'express-validator/check'


const router = express.Router();
import {Client} from '../models/Client';
import {EmailTemplate} from '../models/EmailTemplate';
import {logger} from '../logs/logger';
import {authenticate} from '../utils/auth';
import email from '../email/config';
import {msg} from '../email/config';
import multer from 'multer';
import {storage, getOneFile} from '../db/mongoose';
import _ from 'lodash';
import errorHandler from '../db/dbErrorHandler'


const upload = multer({storage});
const checkBody=buildCheckFunction(['body']);


router.post('/signup', async (req, res) => {
    try {

        if (!await Client.findOne({email: req.body.email})) {
            const body = req.body;
            console.log(body);
            let client = await Client.add(body);
            console.log(client);
            let token = await client.generateAuthTokenRegistration(body.options);

            let template = await EmailTemplate.getEmailTemplate('welcome', {
                userName: client.firstName,
                clientUrl: `${process.env.ROOT_URL}/client/${client.slug}`,
                clientName: client.firstName.concat(' ', client.lastName)
            });

            console.log(template);
            msg.to = client.email;
            msg.subject = template.subject;
            msg.html = template.message;
            console.log('msg  ', msg);
            await email(msg);
            console.log('AFTER SENDING EMAIL');

            res.status(200)
                .cookie('token', token, {httpOnly: true})
                .json({
                    message: 'Created successfully',
                    slug: client.slug
                });

        } else {
            res.status(400)
                .json({
                    error: 'Given user exists'
                });
        }
    } catch (e) {
        console.log(`ERRRORRRRRR ${e}`);
        res.status(400)
            .json({
                error: errorHandler.getErrorMessage(e)
            })
    }
});

router.post('/login', async (req, res) => {
    try {
        let body = req.body;
        const client = await Client.findByCredentials(body.email, body.password);
        const token = await client.generateAuthToken();


        res.status(200)
            .cookie('token', token, {httpOnly: true})
            .json({
                message: 'Login successfully',
                slug: client.slug
            })


    } catch (e) {
        console.log(e);
        res.status(400).json({
            error: e
        })
    }
});

router.delete('/me/token', authenticate, async (req, res) => {
    try {
        await req.client.removeToken(req.token);
        res.clearCookie('token', {path: '/'}).status(200).json({
            message: 'OK'
        });

    } catch (e) {
        res.status(400).json({
            error: e
        })
    }
});


router.get('/:slug', authenticate, async (req, res) => {
    console.log(req.params.slug);
    try {
        let slug = req.params.slug;
        console.log('slug  ', slug);
        let client = await Client.findOne({slug: slug});

        res.status(200).json({
            email: client.email,
            firstName: client.firstName,
            lastName: client.lastName,
            reservation: client.reservation,
            phoneNumber: client.phoneNumber,
            photography: client.photography
        })
    } catch (e) {
        res.status(400).json({
            error: `Bad credentials client with slug: ${e} doesn't exsits`
        })
    }
});

//dziala XD
//isEmpty it's mean that validator force filed value to be EMPTY
router.post('/upload/:slug',authenticate,
    [ checkBody('firstName').isEmpty().withMessage('firstName is required'),
    checkBody('lastName').isEmpty().withMessage('lastName is required'),
    checkBody('email').isEmpty().withMessage('email is required'),
    checkBody('phoneNumber').isEmpty().withMessage('phoneNumber is required')],
    upload.single('file'), (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(JSON.stringify(errors.array(true)));
            return res.status(422).json({error: errors.array()})
        }
        const body=req.body;

        Client.findByToken(req.token).then((client) => {
            console.log(client.photography);
            if(client.photography){
                console.log('something');
                let error=deleteFile(client.photography);

                if(error){
                    console.log(error);
                    res.status(400).send(error);
                }
            }
            console.log('SAVING  ',JSON.stringify(req.file))
            client.firstName=body.firstName;
            client.lastName=body.lastName;
            client.phoneNumber=body.phoneNumber;
            client.email=body.email;
            client.photography = req.file.filename;
            client.save();
            res.status(200).send('OK');
        }).catch((e) => {
            res.status(400).send(e);
        });


        // console.log(${JSON.stringify(req.file});
    });

router.route('/profile/image/:avatar')
    .get(getOneFile);


export default router;