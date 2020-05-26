const router = require('express').Router();
const db = require('../connection');
const transporter = require('../sender');
const jwt = require('jsonwebtoken');

router.post('/', (req, res) => {
    let query = 'SELECT * FROM `users` WHERE `email` = ?';
    let { email } = req.body;

    db.query(query, email, async(error, result) => {
        if(error) throw error;
        
        if(result.length === 0) {
            // res.status(404).json({error: 'Email was not found'});
            const mailOptions = {
                from: '"DevTest" <vladik.semyonov.dev@gmail.com>',
                to: email,
                subject: 'Verify account',
                html: `<p>Sorry, this email (${email}) was not found on our site. Please register an account if you wish to use our services</p>`
            }
            transporter.sendMail(mailOptions, (error, info) => {
                if(error) throw error;
                res.status(200).json(info);
            })

        } else if(result) {
            if(result[0].state === 'active') {
                const mailOptions = {
                    from: '"DevTest" <vladik.semyonov.dev@gmail.com>',
                    to: result[0].email,
                    subject: 'Verify account',
                    html: `<h4>Hello ${result[0].username},</h4>
                    <p>Your account is already activated! Please login with your email and password to continue using our website</p>`
                }
                transporter.sendMail(mailOptions, (error, info) => {
                    if(error) throw error;
                    res.status(200).json(info);
                })
            } else if(result[0].state === 'pending') {
                const payload = {subject: result[0].id};
                const token = jwt.sign(payload, process.env.JWT_EMAIL_SECRET, { expiresIn: '1d'});
                
                const mailOptions = {
                    from: '"DevTest" <vladik.semyonov.dev@gmail.com>',
                    to: result[0].email,
                    subject: 'Verify account',
                    html: `<h4>Hello ${result[0].username},</h4>
                    <p>Please validate your account by following the link below</p>
                    <a href='http://localhost:3000/api/auth/${token}'>${token}</a>
                    <p style="color: gray">The current link will be available for 24 hours</p>`
                }
                transporter.sendMail(mailOptions, (error, info) => {
                    if(error) throw error;
                    res.status(200).json(info);
                })
            }
        }
    })
})










module.exports = router;