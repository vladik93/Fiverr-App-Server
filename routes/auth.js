const router = require('express').Router();
const mysql = require('../connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { checkToken } = require('../middleware/verifyToken');

router.post('/register', async(req, res) => {
    let query = 'INSERT INTO `users` (`username`, `email`, `password`) VALUES (?, ?, ?)';
    // let lastId = 'SELECT LAST_INSERT_ID()';
    let statsQuery = 'INSERT INTO `stats` (`user_id`) VALUES (?)';
    let salt = await bcrypt.genSalt(10);
    let hashed = await bcrypt.hash(req.body.password, salt);
    let {username, email} = req.body;

    mysql.query(query, [username, email, hashed], (error, result) => {
        if(error) throw error;
        // res.status(200).json(result.insertId);
        mysql.query(statsQuery, [result.insertId], (error, value) => {
            if(error) throw error;
            res.status(200).json(result);
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
            res.json({message: 'Invalid email!'});
        } else {
            const result = await bcrypt.compare(password, value[0].password);
            if(result) {
                value[0].password = null;
                const payload = { subject: value[0]};
                const token = await jwt.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: '1d'
                });
                return res.json({token: token, username: value[0].username});
            } else {
                res.status(400).json({message: 'Invalid password'});
            }
        };
        
    })
});

router.get('/data', checkToken, (req, res) => {
    res.send('Hello User');
});













module.exports = router;