require('dotenv').config();
const http = require('http');
const chalk = require('chalk');
const app = require('./src/app');
const logger = require('./src/lib/logger');



const port = process.env.PORT || 6421;
const server = http.createServer(app);


server.listen(port, () =>
    logger.info(
        chalk.bgGreen(`Server running on port: ${chalk.bgGreen(port)} `)
    )
);