const {Joi} = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const createBuyedProperty = {
    body: Joi.object().keys({
        propertyName: Joi.string().required(),
        propertyLocation: Joi.string().required(),
        propertyPrice: Joi.number().required(),
        propertyDescription: Joi.string().required(),
        tokenId: Joi.number().required(),
        buyedPrice: Joi.number().required(),
        tokenQuantity: Joi.number().required(),
        imageUrl: Joi.array().items(Joi.string()).required(),
        propertyType: Joi.string().optional(),
        rentalPerToken: Joi.number().optional(),
        walletAddress: Joi.string().required(),
    })
}



module.exports = {
    createBuyedProperty
}