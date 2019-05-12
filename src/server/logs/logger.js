import winston from  'winston';
import appRoot from 'app-root-path';


console.log(` app rooot ${appRoot}`);

var options={
    file:{
        level: 'info',
        filename: `${appRoot}/src/server/logs/app.log`,
        handleException: true,
        json: true,
        maxSize: 524880,
        maxFiles: 5,
        colorize: false
    },
    console:{
        level: 'debug',
        handleException: true,
        json: false,
        colorize: true
    },
};

var logger=winston.createLogger({
    transports:[
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false
});

logger.stream={
    write: function (message, encoding) {
        //use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info(message);
    },
};

export {  logger };