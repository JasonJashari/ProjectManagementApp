// This file spins up the express application which will make handling requests a bit easier for us
const express = require('express');
// spins up express application where we can use all kinds of utility methods and so on
const app = express();
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const credentials = require('./api/middleware/credentials');

const cardRoutes = require('./api/routes/cards');
const listRoutes = require('./api/routes/lists');
const userRoutes = require('./api/routes/user');
const boardRoutes = require('./api/routes/boards');

require('dotenv').config();
mongoose.connect(process.env.MONGO_URI);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(credentials);

// Handling CORS and OPTIONS request
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// use sets up a middleware, with filter '/cards'. Incoming request has to go through app.use()
app.use('/cards', cardRoutes);
app.use('/lists', listRoutes);
app.use('/user', userRoutes);
app.use('/boards', boardRoutes);

// Serve frontend
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static(path.join(__dirname, './frontend/build')));
    // Point any route (aside from api routes) to the index html
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname,
        './', 'frontend', 'build', 'index.html'))
    );
} else {
    app.get('/', (req, res) => res.send('Please set to production'))
}

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;