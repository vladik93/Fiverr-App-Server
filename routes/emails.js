const express = require('express');
const router = express.Router();
const mysql = require('../connection');
const { checkToken } = require('../middleware/verifyToken');

router.post('/', (req, res) => {
    let query = 'INSERT INTO subscriptions (`email`) VALUES (?)';
    mysql.query(query, [req.body.email], (error, value) => {
        if(error) throw error;
        res.status(200).json(value);
    })
});


router.post('/:id', checkToken, (req, res) => {
    // res.json(req.user.id);
    let query = 'SELECT u.id AS userId, u.username AS userName, u.email AS userEmail, t.id AS transId, t.name AS transName, t.email AS transEmail, t.phone AS transPhone, lang_from.name AS fromLang, lang_to.name AS toLang FROM users AS u JOIN translators AS t ON t.id = ? LEFT JOIN languages AS lang_from ON t.lang_from = lang_from.id LEFT JOIN languages AS lang_to ON t.lang_to = lang_to.id WHERE u.id = ?';

    mysql.query(query, [req.params.id, req.user.id], (error, result) => {
        if(error) throw error;
        res.status(200).json(result);
    })

});


module.exports = router;









module.exports = router;