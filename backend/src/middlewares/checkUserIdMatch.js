const checkUserIdMatch = (req, res, next) => {
    if (req.user._id !== req.params.id) {
        return res.status(401).json({
            data: null,
            success: false,
            message: 'Unauthorized!',
        });
    }
    next(); // Continue to the next middleware or route handler
};
module.exports = checkUserIdMatch;