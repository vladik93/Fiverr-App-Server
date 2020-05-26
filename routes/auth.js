const router = require('express').Router();
const mysql = require('../connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { checkToken } = require('../middleware/verifyToken');
const transporter = require('../sender');


router.get('/:token', (req, res) => {
    jwt.verify(req.params.token, process.env.JWT_EMAIL_SECRET, (error, payload) => {
        if(error) throw error;
        // res.status(200).json(payload.subject);
        let tokenQuery = 'INSERT INTO `tokens` (`token`) VALUES (?)';
        mysql.query(tokenQuery, [req.params.token], (error, insert) => {
            if(error) return res.status(403).json({error: 'User already verified'});
            
            let query = "UPDATE `users` SET `state` = 'active' WHERE id = ?";
            mysql.query(query, [payload.subject], (error, value) => {
                if(error) throw error;
                res.redirect('http://localhost:4200');
            })
            
        })
    })
})

router.post('/register', async(req, res) => {
    let query = 'INSERT INTO `users` (`username`, `email`, `password`, `subscribed`) VALUES (?, ?, ?, ?)';
    // let lastId = 'SELECT LAST_INSERT_ID()';
    let userSelectQuery = 'SELECT * FROM `users` WHERE id = ?';
    let emailSubQuery = 'INSERT INTO `subscriptions` (`email`) VALUES (?)';
    let statsQuery = 'INSERT INTO `stats` (`user_id`) VALUES (?)';
    let salt = await bcrypt.genSalt(10);
    let hashed = await bcrypt.hash(req.body.password, salt);
    let {username, email, subscribed} = req.body;

    mysql.query(query, [username, email, hashed, subscribed], async(error, result) => {
        if(error) throw error;
        mysql.query(userSelectQuery, [result.insertId], async(error, user) => {
            if(error) throw error;
            // res.status(200).json(result[0].subscribed);
            const payload = {subject: user[0].id};
            const token = jwt.sign(payload, process.env.JWT_EMAIL_SECRET, { expiresIn: '1d'});

            const mailOptions = {
                from: '"DevTest" <vladik.semyonov.dev@gmail.com>',
                to: user[0].email,
                subject: 'Verify accound',
                html: `<h4>Hello ${user[0].username},</h4>
                <p>Please validate your account by following the link below</p>
                <a href='http://localhost:3000/api/auth/${token}'>${token}</a>
                <p style="color: gray">The current link will be available for 24 hours</p>`
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if(error) throw error;
                res.status(200).json(info);
            })

            if(user[0].subscribed === 1) {
                mysql.query(emailSubQuery, [user[0].email], (error, result) => {
                    if(error) throw error;
                    mysql.query(statsQuery, [user[0].id], (error, value) => {
                        if(error) throw error;
                        res.status(200).json(value);
                    })
                })
            } else {
                mysql.query(statsQuery, [user[0].id], (error, value) => {
                    if(error) throw error;
                    res.status(200).json(value);
                })
            }
        })
    });
        
});

router.post('/login', async(req, res) => {
    const { email, username, password } = req.body;
    let query = 'SELECT * FROM `users` WHERE `email` = ?';
    mysql.query(query, email, async(error, value) => {
        if(error) { 
            throw error 
        } else if(value.length === 0) {
            res.status(401).json({message: 'Invalid email!'});
        } else {
            const result = await bcrypt.compare(password, value[0].password);
            if(result) {

                if(value[0].state === 'banned') {
                    res.status(403).json({forbidden: 'Current user is banned!'});
                    return;
                } else if(value[0].state === 'pending') {
                    res.status(403).json({forbidden: 'Account not validated!'});
                } else {
                    value[0].password = null;
                    const payload = { subject: value[0]};
                    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
                        expiresIn: '1d'
                    });
                    return res.json({token: token, username: value[0].username});
                }
            } else {
                res.status(401).json({message: 'Invalid password'});
            }
        };
        
    })
});

router.get('/data', checkToken, (req, res) => {
    res.send('Hello User');
});













module.exports = router;