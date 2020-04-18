const router = require('express').Router();
const mysql = require('../connection');

let counter = 1;

counterCondition = () => {
    if(this.counter === 2) {
        return console.log('Counter at 2');
    }

}




router.get('/', (req, res) => {
    let query = 'SELECT * FROM ads WHERE id = ?';

    mysql.query(query, [counter], (error, result) => {
        if(error) throw error;
        res.status(200).json(result);
        console.log(counter);
        (counter < 3) ? counter = counter + 1 : counter = 1;
    })
})













module.exports = router;