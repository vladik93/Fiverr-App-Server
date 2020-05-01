const router = require('express').Router();
const mysql = require('../connection');
const { checkToken } = require('../middleware/verifyToken');

router.get('/userInfo', checkToken, (req, res) => {
   res.status(200).json(req.user)
});

router.post('/:userid/translator/transId', checkToken, (req, res) => {
   
});














module.exports = router;