const express = require('express');

const routes = require('./routes');
const middlewares = require('./middlewares');
const errorHandle = require('./middlewares/errorHandle')
const db = require('./config/db');

const app = express();
app.enable('trust proxy'); // only if behind a reverse proxy (Heroku, AWS ELB, Nginx, etc)

middlewares(app); // initialize middlewares
db(app); // database connection
routes(app); // initialize routes
errorHandle(app); // error handlers

module.exports = app;
