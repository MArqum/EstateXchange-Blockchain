const rateLimit = require("express-rate-limit");

const serverRequest = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 50, // limit each IP to 50 requests per windowMs,
    message : "Too many request attempt. Please try again after 5 minutes!",
    statusCode: 429,
    headers: true
});

module.exports = {
    serverRequest
}
