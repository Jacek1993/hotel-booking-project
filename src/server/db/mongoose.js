import '../config/config';
import  mongoose from 'mongoose';
import GridFsStream from 'gridfs-stream';
import  GridFsStorage from 'multer-gridfs-storage';
import  crypto from'crypto';
import path from 'path';
import {Client} from "../models/Client";


mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://test:040993jrula@ds145563.mlab.com:45563/todoapp');
mongoose.connect(process.env.MONGODB_URI);


const conn = mongoose.connection;
let gfs;

conn.once('open', function () {
    gfs = GridFsStream(conn.db, mongoose.mongo);
    gfs.collection('uploads');
    return gfs;


});



const storage = new GridFsStorage({
    url: process.env.MONGODB_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});


const deleteFile = (filename) => {
    let error;
    gfs.remove({filename: filename}, (err) => {
        if (err) {
            console.log(err);
            error = err;
        }
        else
            console.log('success');
    });

    return error;
};

const getOneFile = (req, res) => {
    Client.findOne({slug: req.params.avatar}, (err, client)=>{

        gfs.files.findOne({filename: client.photography}, (err, file) => {
            if (! file || file.length===0) {
                return res.status(404).json({
                    error: 'Image not found'
                })
            }
            if(file.contentType==='image/jpeg' || file.contentType==='image/png'){
                const readStream=gfs.createReadStream(file.filename);
                readStream.pipe(res)
            }
            else{
                res.status(404).json({
                    error: 'It is not an image'
                })
            }
        });
    });


};




export  {mongoose, storage, deleteFile, getOneFile};