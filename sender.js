const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    // host: process.env.MAIL_HOST,
    // port: parseInt(process.env.MAIL_PORT),
    auth: {
        type: process.env.AUTH_TYPE,
        user: process.env.MAIL_USER,
        accessToken: process.env.ACCESS_TOKEN, // Could be removed after expiration
        expires: 1588423783204 + 60000, // Could be removed after expiration
        refreshToken: process.env.REFRESH_TOKEN,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        accessUrl: process.env.ACCESS_URI // Field not needed if using Gmail
    }
});

transporter.verify((error, success) => {
    if(error) {
        console.log(error)
    } else {
        console.log('Server is ready to take our messages');
    }
})

transporter.on('token', token => {
    console.log('A new access token was generated');
    console.log('User: %s', token.user);
    console.log('Access Token: %s', token.accessToken);
    console.log('Expires: %s', new Date(token.expires));
});

module.exports = transporter;
