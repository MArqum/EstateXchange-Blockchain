const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const morgan = require('morgan');
const log = require('../lib/logger');
const fileUpload = require('express-fileupload');
const { serverRequest } = require('./requestAttempt');

const sessionConfig = {
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
}

module.exports = (app) => {
    app.use(cors());
    app.use(fileUpload());
    // app.use(serverRequest);
    app.use(session(sessionConfig));
    app.use('/public', [express.static('public')]);
    app.use(helmet({ crossOriginResourcePolicy: false }));
    app.use(express.json({ limit: '50mb', extended: true }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.use(morgan('dev', { stream: { write: (m) => log.http(m.trim()) } }));
};
