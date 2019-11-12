const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log('options', options);
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'Marcio Rodrigues <mafideju@outlook.com>',
    to: options.email,
    subject: options.subject,
    // message: options.message,
    html: `
      <h1>Pegue Aqui Seu Token</h1>
      <p>${options.message}</p>
    `,
  };

  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
