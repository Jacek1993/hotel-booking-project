const env =process.env.NODE_ENV || 'development';
import  fs from 'fs'
import config from'./config.json';
import path from 'path';
//var password='123abc!';


if(env==='development' || env==='test'){
           //automatically convert to Object


    let envConfig=config[env];          //if env is equal to development than we go to develpment process otherwise to test in config.json
    Object.keys(envConfig).forEach((key)=>{
        process.env[key]=envConfig[key];
    });
    const DIR_PATH=__dirname.split('dist')[0];

        console.info('MONGODB URI', process.env.MONGODB_URI);
    process.env['PRIVATE_KEY']=fs.readFileSync(DIR_PATH+'src/server/config/private.key', 'utf8');
    process.env['PUBLIC_KEY']=fs.readFileSync(DIR_PATH+'src/server/config/public.key', 'utf-8');


}