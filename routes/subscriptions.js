const express = require('express');
const router = express.Router();
const mysql = require('../connection');

router.post('/', (req, res) => {
    let query = 'INSERT INTO subscriptions (`email`) VALUES (?)';
    mysql.query(query, [req.body.email], (error, value) => {
        if(error) throw error;
        res.status(200).json(value);
    })
});












module.exports = router;