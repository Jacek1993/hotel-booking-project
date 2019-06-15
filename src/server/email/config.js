import sgMail from '@sendgrid/mail';
import '../config/config';
import  {EmailTemplate} from '../models/EmailTemplate';

sgMail.setApiKey( process.env.SENDGRID_API_KEY);

async function sendEmail(kind, filling, email) {
    const template=await EmailTemplate.getEmailTemplate(kind, filling);
    msg.to=email;
    msg.subject=template.subject;
    msg.html=template.message;
    msg.from=process.env.OWNER_EMAIL;
    await sgMail.send(msg);
};

export default sendEmail;

