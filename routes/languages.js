const express = require('express');
const router = express.Router();
const mysql = require('../connection');

router.get('/', (req, res) => {
    let query = 'SELECT * FROM languages';
    
    mysql.query(query, (error, values) => {
        if(error) throw error;
        res.status(200).json(values);
    })
});









module.exports = router;