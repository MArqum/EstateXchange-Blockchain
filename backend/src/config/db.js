const chalk = require('chalk');
const Mongoose = require('mongoose');
Mongoose.set("strictQuery", false);

const logger = require('../lib/logger');

const db = async (app) => {
    try {
        Mongoose.connect(process.env.DB_URI, {
            connectTimeoutMS: 30000,
            socketTimeoutMS: 60000,
            tlsInsecure: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        logger.info(chalk.blue('Database Connection Succeeded!'))
        return app
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

module.exports = db;