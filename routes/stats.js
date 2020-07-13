const router = require('express').Router();
const { checkToken } = require('../middleware/verifyToken');
const mysql = require('../connection');

router.get('/', checkToken, (req, res) => {
    let query = 'SELECT * FROM `stats` WHERE `user_id`=?';
    mysql.query(query, [req.user.id], (error, result) => {
        if(error) throw error;
        res.status(200).json(result);
    })
})

router.put('/', checkToken, (req, res) => {
    if(req.query.prop === 'visited') {
        let query = 'UPDATE `stats` SET `times_visited` = `times_visited` + 1 WHERE `user_id` = ?';
        mysql.query(query, [req.user.id], (error, result) => {
            if(error) throw error;
            res.status(200).json(result);
        })
    }
})















module.exports = router;