// put your secrets :>
require('dotenv').config();

// imports
const express = require('express');
const cors = require('cors');
const routes = require('./Routes');
const db = require('./modules/databaseConnection');

// create app
const app = express();

// send static files.. Optional
app.use(express.static('static'));

// main http://localhost:3001
app.get('/', (req , res) => {
    res.sendStatus(200);
});

// connect to mongodb localhost or mongodb remote database
db();

// usages
app.use(express.json());
app.use(cors({ origin: '*', optionsSuccessStatus: 200 })); // * enable for all origin, put your domain or ip
app.use('/api', routes);

// initialize app
app.listen(3001, () => console.log("[READY] - Open your browser in http://localhost:3001"));