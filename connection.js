const mysql = require('mysql');
const config = require('./config/db.config');

const connection = mysql.createConnection({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB
});

connection.connect((error) => {
    if(error) throw error;
    console.log('Connected to database');
});



module.exports = connection;