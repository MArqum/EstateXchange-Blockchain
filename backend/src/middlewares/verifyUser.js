const propertyModel = require("../models/propertyListing");
const mongoose = require("mongoose");


const verifyUser = async(req, res, next) => {
    try {
        let query = {
            user: new mongoose.Types.ObjectId(req.user._id),
            tokenId: req.body.tokenId
        }
        const data = await propertyModel.findOne(query)
        if(!Object.keys(data).length){
            let err = 'Record not found to update'
            next(err);
        }
        next();
        //  req.user._id
    } catch (err) {
        console.log(err);
        return next(err);
    }
}

module.exports = verifyUser;