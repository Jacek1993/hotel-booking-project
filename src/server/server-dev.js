import path from 'path'
import express from 'express'
import bodyParser from 'body-parser';
import winston from 'winston';
import morgan from 'morgan';
import './config/config';
import {mongoose} from 'mongoose';
import {logger} from './logs/logger';
import room from './routes/room';
import reservation from './routes/reservation';
import client from './routes/client';
import {authenticate} from './utils/auth'
import email from './email/config';
import opinion from './routes/opinion';
import {EmailTemplate} from './models/EmailTemplate';
import cookieParser from 'cookie-parser';

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../../webpack.dev.config.js'

const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html'),
            compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

(async function save() {
    await EmailTemplate.initTemplate();
})();

app.use(webpackHotMiddleware(compiler));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('combined', {stream: logger.stream}));
app.use('/room', room);
app.use('/reservation', reservation);
app.use('/client', client);
app.use('opinion', opinion);

app.route('/something')
    .get(authenticate, (req,res)=>{
    res.clearCookie('token',{path: '/'}).status(200).json({
        cookie: req.cookies
    })
});

app.get('/checkToken', authenticate, (req, res)=>{
    res.sendStatus(200);
});

// app.get('*', (req, res, next) => {
//   compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
//   if (err) {
//     return next(err)
//   }
//   res.set('content-type', 'text/html')
//   res.send(result)
//   res.end()
//   })
// })

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
});

export {app};
