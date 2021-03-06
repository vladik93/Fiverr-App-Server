const express = require('express');
const router = express.Router();
const mysql = require('../connection');

router.get('/', (req, res) => {
    let query = 'SELECT * FROM translators WHERE lang_to = ? AND featured = ? ORDER BY RAND() LIMIT  ?'; // LIMIT only accepts INTEGERS!
    let query2 = "SELECT tr.id, tr.name, tr.description, tr.image, tr.lang_from, IFNULL(langfrom.image, 'http://localhost/translation_app/not-specified.png') AS image_from, langfrom.code AS code_from, tr.lang_to, langto.image AS image_to, langto.code AS code_to, tr.price FROM translators AS tr INNER JOIN languages AS langto ON tr.lang_to = langto.id LEFT JOIN languages AS langfrom ON tr.lang_from = langfrom.id WHERE lang_to = ? LIMIT ? OFFSET ?";
    let query3 = "SELECT tr.id, CONCAT_WS('', tr.name, ' ', '(',IFNULL(UPPER(langfrom.code), '?'), ' → ', UPPER(langto.code), ')')  AS value FROM translators AS tr INNER JOIN languages AS langto ON tr.lang_to = langto.id LEFT JOIN languages AS langfrom ON tr.lang_from = langfrom.id"
    let query4 = 'SELECT * FROM translators WHERE featured = ? ORDER BY RAND() LIMIT ?';

    if(req.query.offset) {
        mysql.query(query2, [req.query.lang_to, parseInt(req.query.limit), parseInt(req.query.offset)], (error, value) => {
            if(error) throw error;
            res.status(200).json(value);
        })
    } else if(req.query.lang_to) {
        mysql.query(query, [req.query.lang_to, 1, parseInt(req.query.limit)], (error, value) => {
            if(error) throw error;
            res.status(200).json(value);
        });
    } else if(req.query.typeahead === 'true') {
        mysql.query(query3, (error, values) => {
            if(error) throw error;
            res.status(200).json(values);
        })
    } else if(req.query.limit) {
        mysql.query(query4, [1, parseInt(req.query.limit)], (error, values) => {
            if(error) throw error;
            res.status(200).json(values);
        })
    }
});

router.get('/:id', (req, res) => {
    let query = "SELECT tr.id, tr.name, tr.description, tr.image, tr.lang_from, IFNULL(langfrom.image, 'http://localhost/translation_app/not-specified.png') AS image_from, langfrom.code AS code_from, tr.lang_to, langto.image AS image_to, langto.code AS code_to, tr.price, tr.email, tr.phone FROM translators AS tr INNER JOIN languages AS langto ON tr.lang_to = langto.id LEFT JOIN languages AS langfrom ON tr.lang_from = langfrom.id WHERE tr.id = ?";
    mysql.query(query, [req.params.id], (error, values) => {
        if(error) throw error;
        res.status(200).json(values);
    });
});










module.exports = router;