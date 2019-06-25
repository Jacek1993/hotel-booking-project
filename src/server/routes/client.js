import express from 'express';
import {deleteFile} from '../db/mongoose';
import '../config/config';
import {check, validationResult} from 'express-validator/check'


const router = express.Router();
import {Client} from '../models/Client';
import {authenticate} from '../utils/auth';
import email from '../email/config';
import multer from 'multer';
import {storage, getOneFile} from '../db/mongoose';
import errorHandler from '../db/dbErrorHandler'


const upload = multer({storage});



router.post('/signup', [check('email').isEmail(), check('firstName').isAlpha(), check('lastName').isAlpha(), check('password').isLength({min: 6})], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array().map(e=>e.param+' '+e.msg).reduce((init, e)=>init+=e, '') });
    }
    try {

        if (!await Client.findOne({email: req.body.email})) {
            const body = req.body;
            console.log(body);
            let client = await Client.add(body);
            console.log(client);
            let token = await client.generateAuthTokenRegistration(body.options);
            const userCredentials={
                userName: client.userName,
                clientUrl: `${process.env.ROOT_URL}/client/${client.slug}?x-auth=${token}`,
                clientName: client.firstName.concat(' ', client.lastName)
            };
            await email('welcome', userCredentials, client.email);
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
        res.status(400)
            .json({
                error: errorHandler.getErrorMessage(e)
            })
    }
});

router.post('/login',[check('email').isEmail(), check('password').isLength({min: 6})], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array().map(e=>e.param+' '+e.msg).reduce((init, e)=>init+=e, '') });
    }
    try {
        let body = req.body;
        const client = await Client.findByCredentials(body.email, body.password);
        const token = await client.generateAuthToken();



        res.status(200)
            .cookie('token', token, {httpOnly: true})
            .json({
                message: 'Login successfully',
                slug: client.slug,
                role: client.role
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
        let client = await Client.findOne({slug: slug}).populate('reservation').exec();

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


router.post('/upload/:slug',authenticate, upload.single('file'), (req, res) => {

        const body=req.body;
        Client.findByToken(req.token).then((client) => {
            console.log(client.photography);
            if(client.photography){
                let error=deleteFile(client.photography);
                if(error){
                    console.log(error);
                    res.status(400).send(error);
                }
            }
            client.firstName=body.firstName;
            client.lastName=body.lastName;
            client.phoneNumber=body.phoneNumber;
            client.email=body.email;
            if(req.file) {
                client.photography = req.file.filename;
            }
            client.save();
            res.status(200).send('OK');
        }).catch((e) => {
            res.status(400).send(e);
        });

    });

router.get('/reservation/opened', authenticate,async (req,res)=>{
    try{
        const client=await Client.findAnyProcessedReservation(req.client.slug);
        res.status(200).send(client);
    }catch(e){
        res.status(400).json({
            error: e
        })
    }
})



router.route('/profile/image/:avatar')
    .get(getOneFile);


export default router;