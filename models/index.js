const connection = require('../connection');
const Sequelize = require('sequelize');

module.exports = sequelize = new Sequelize({
    database: 'language_db',
    username: 'root',
    password: '',
    dialect: 'mysql'
});

sequelize
    .authenticate()
    .then(() => console.log('Connection has been established'))
    .catch(error => console.log('Unable to connect to database'));