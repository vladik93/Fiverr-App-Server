const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT),
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

transporter.verify((error, success) => {
    if(error) {
        console.log(error)
    } else {
        console.log('Server is ready to take our messages');
    }
})

module.exports = transporter;
