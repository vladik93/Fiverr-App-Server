const express = require('express');
const router = express.Router();
const mysql = require('../connection');

router.get('/', (req, res) => {
    let query = 'SELECT * FROM translators WHERE lang_to = ? LIMIT  ?'; // LIMIT only accepts INTEGERS!
    let query2 = 'SELECT * FROM translators WHERE lang_to = ? LIMIT ? OFFSET ?';

    if(req.query.offset) {
        mysql.query(query2, [req.query.lang_to, parseInt(req.query.limit), parseInt(req.query.offset)], (error, value) => {
            if(error) throw error;
            res.status(200).json(value);
        })
    } else {
        mysql.query(query, [req.query.lang_to, parseInt(req.query.limit)], (error, value) => {
            if(error) throw error;
            res.status(200).json(value);
        });
    }
})













module.exports = router;