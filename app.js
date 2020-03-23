const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

app.use('/api/languages', require('./routes/languages'));














app.listen(port, () => {
    console.log('Connected to port: ' + port);
});