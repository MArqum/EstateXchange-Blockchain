const { Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const createRentProperty = {
    body: Joi.object().keys({
        propertyName: Joi.string().required(),
        propertyPrice: Joi.number().required(),
        tokenId: Joi.number().required(),
        rentToken: Joi.number().optional(),
        walletAddress: Joi.string().required(),
        user: Joi.string().required(),
    })
}



module.exports = {
    createRentProperty
}