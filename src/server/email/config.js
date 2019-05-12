import sgMail from '@sendgrid/mail';
import '../config/config';
import  {EmailTemplate} from '../models/EmailTemplate';

sgMail.setApiKey( process.env.SENDGRID_API_KEY);

async function sendEmail(msg) {
    await sgMail.send(msg);
};

const msg= {
    to: '',
    from: process.env.OWNER_EMAIL,
    subject: '',
    html: '',
};

export {msg};
export default sendEmail;

