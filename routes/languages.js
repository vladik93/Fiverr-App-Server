const express = require('express');
const router = express.Router();
const mysql = require('../connection');

router.get('/', (req, res) => {
    let query = 'SELECT * FROM languages';
    let query_two = 'SELECT * FROM languages LIMIT ?';
    
    if(!req.query.limit) {
        mysql.query(query, (error, values) => {
            if(error) throw error;
            res.status(200).json(values);
        })
    } else {
        mysql.query(query_two, [parseInt(req.query.limit)], (error, values) => {
            if(error) throw error;
            res.status(200).json(values);
        })
    }
});









module.exports = router;