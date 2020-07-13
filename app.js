require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');




const app = express();

app.use(cors());

const db = require('./connection');
const userDB = require('./models');
const Role = userDB.role;

userDB.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync User DB');
    initial();
})


app.use(express.urlencoded({extended: true}));
app.use(express.json());


const port = process.env.PORT || process.env.APP_PORT;

app.use('/api/languages', require('./routes/languages'));
app.use('/api/translators', require('./routes/translators'));
app.use('/api/emails', require('./routes/emails'));
app.use('/api/ads', require('./routes/ads'));
app.use('/api/stats', require('./routes/stats'));
// Auth Routes
app.use('/api/user', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/logged', require('./routes/logged'));















app.listen(port, () => {
    console.log('Connected to port: ' + port);
});