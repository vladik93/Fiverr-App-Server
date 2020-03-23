const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'language_db'
});

connection.connect((error) => {
    if(error) throw error;
    console.log('Connected to database');
});



module.exports = connection;