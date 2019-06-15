import mongoose from 'mongoose';
import _  from 'lodash';
const {Schema} =mongoose;

const EmailTemplateSchema = new Schema({
    name: {type: String},
    subject: {type: String},
    message: {type: String}
});

class EmailTemplateClass{
    static async initTemplate(){
        const templates = [
            {
                name: 'welcome',
                subject: 'Welcome to buking.com',
                message: `<%= userName %>,
        <p>
            View Your profile: <a href="<%= clientUrl %>" target="_blank"><%= clientName %></a>
        </p>
        <p>
          See list of available books here.
        </p>
        Jacek and Marcin,
        Internet Engineering Team`
            },
            {
                name: 'purchase',
                subject: 'You just made reservation at buking.com',
                message: `<%= userName %>,
        <p>
          We are pleased to confirm you lodging reservation and look forward to your visit.
        </p>
        <p>
          View Your reservation: <a href="<%= reservationUrl %>" target="_blank"><%= reservationTittle %></a>
        </p>
        <p>
          If you have any questions please don't hesitate to contact with us.
          email: mati@mati.hub.pl
        </p>
       Jacek and Marcin,
        Internet Engineering Team`
            },
            {
                name: 'reservationRemoval',
                subject: 'Your reservation has been remove',
                message: `<%= userName %>,
        <p>
          Unfortunately Your reservation has been removed by <%= employer %>
        </p>
        <p>
          If reservation was removed by our employer probably room that You booked is under construction
        </p>
        <p>
          If you have any questions please don't hesitate to contact with us.
          email: mati@mati.hub.pl
          Or you can call to us +48 782 052 221
        </p>
       Jacek and Marcin,
        Internet Engineering Team`
            }
        ];
        templates.forEach(async (template) => {
              console.log('Do something', await EmailTemplate.findOne({name: template.name}).count());

            if ((await  EmailTemplate.findOne({ name: template.name }).count())>0) {
              console.log('inserted');
            return;
            }
            console.log('in foEach function');
            await EmailTemplate.create(template).catch((error) => {
                console.error('EmailTemplate insertion error:', error);
            });
            console.log('In for each')
        });
    }

   static  async getEmailTemplate(name, params) {
       console.log(name + '  ' + params);
       const source = await EmailTemplate.findOne({name: name});
       if (!source) {
           return Promise.reject(`No EmailTemplates found. `);
       }
       console.log('source ',source);
       return {
           message: _.template(source.message)(params),

           subject: _.template(source.subject)(params)
       };
   }
}
EmailTemplateSchema.loadClass(EmailTemplateClass);
var EmailTemplate = mongoose.model('EmailTemplate', EmailTemplateSchema);
export {EmailTemplate};