const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
    if (!req.headers.authorization) return res.status(401).json({
        success: false,
        message: "Unauthorized. Token Required!"
    });

    let token;
    const authHeader = req.headers.authorization;


    if (authHeader.startsWith('Bearer ')) {
        // If it does, extract the token
        token = authHeader.substring(7); // Remove "Bearer " from the beginning
    } else {
        // If it doesn't, assume the token is directly provided
        token = authHeader;
    }

    if (!token) {
        return res.status(401).json({ "success": false, "message": "Token Missing!" });
    } else {
        try {
            jwt.verify(token, process.env.JWT_SECRET, false, (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        success: false,
                        message: "Forbidden. Token Invalid!"
                    });
                }
                req.user = decoded.data;
                next();
            });
        } catch (err) {
            console.log(err);
            return next(err);
        }
    }
}

module.exports = verifyToken;
