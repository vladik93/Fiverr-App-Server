const router = require('express').Router();
const mysql = require('../connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { checkToken } = require('../middleware/verifyToken');

router.post('/register', async(req, res) => {
    let query = 'INSERT INTO `users` (`username`, `email`, `password`) VALUES (?, ?, ?)';
    let salt = await bcrypt.genSalt(10);
    let hashed = await bcrypt.hash(req.body.password, salt);
    let {username, email} = req.body;

    mysql.query(query, [username, email, hashed], (error, result) => {
        if(error) throw error;
        res.status(200).json(result);
    })
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
                const jsonwebtoken = await jwt.sign({result: value[0]}, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                });
                return res.json({
                    message: 'Login Successful',
                    token: jsonwebtoken
                });
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