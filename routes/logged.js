const router = require('express').Router();
const mysql = require('../connection');
const { checkToken } = require('../middleware/verifyToken');

router.get('/', (req, res) => {
    res.status(200).send('Hello user!');
});














module.exports = router;