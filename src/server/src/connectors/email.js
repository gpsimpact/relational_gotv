import Mailgun from 'mailgun-js';

const sendEmail = messageData => {
  const mailgun = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });

  return mailgun.messages().send(messageData);
};

export default sendEmail;
