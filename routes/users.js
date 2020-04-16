const router = require('express').Router();
const mysql = require('../connection');
const bcrypt = require('bcryptjs');

router.post('/', async(req, res) => {
    let query = 'INSERT INTO `users` (`username`, `email`, `password`) VALUES (?, ?, ?)';
    let salt = await bcrypt.genSaltSync(10);
    let hash = await bcrypt.hashSync(req.body.password, salt);

    mysql.query(query, [req.body.username, req.body.email, hash], (error, result) => {
        if(error) throw error;
        res.status(200).json(result);
    })
    

});












module.exports = router;