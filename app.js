const express = require('express');
const cors = require('cors');

const app = express();

require('./connection');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

app.use('/api/languages', require('./routes/languages'));
app.use('/api/translators', require('./routes/translators'));














app.listen(port, () => {
    console.log('Connected to port: ' + port);
});