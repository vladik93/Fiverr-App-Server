require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');



const app = express();

require('./connection');

// app.configure(function() {
//     app.use(express.cookieParser('keyboard cat'));
//     app.use(express.session({cookie: {maxAge: 60000}}));
//     app.use(flash());
// });

app.use(cors());

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const port = process.env.PORT || process.env.APP_PORT;

app.use('/api/languages', require('./routes/languages'));
app.use('/api/translators', require('./routes/translators'));
app.use('/api/emails', require('./routes/emails'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/ads', require('./routes/ads'));
app.use('/api/stats', require('./routes/stats'));
// Auth Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/logged', require('./routes/logged'));















app.listen(port, () => {
    console.log('Connected to port: ' + port);
});