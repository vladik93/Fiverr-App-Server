const mysql = require('mysql');
const config = require('./config/db.config');

const connection = mysql.createConnection({
    host: config.HOST,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DB,
});

connection.connect((error) => {
    if(error) throw error;
    console.log('Connected to database');
});



module.exports = connection;