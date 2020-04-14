const express = require('express');
const cors = require('cors');


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

const port = process.env.PORT || 3000;

app.use('/api/languages', require('./routes/languages'));
app.use('/api/translators', require('./routes/translators'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
// Auth Routes
require('./routes/auth')(app);
require('./routes/user')(app);


function initial() {
    Role.create({
        id: 1, 
        name: 'admin'
    });

    Role.create({
        id: 2, 
        name: 'user'
    });
}












app.listen(port, () => {
    console.log('Connected to port: ' + port);
});