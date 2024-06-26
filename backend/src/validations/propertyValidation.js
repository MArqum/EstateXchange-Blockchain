const {Joi} = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const createProperty = {
    body: Joi.object().keys({
        propertyName: Joi.string().required(),
        propertyLocation: Joi.string().required(),
        propertyPrice: Joi.number().required(),
        propertyDescription: Joi.string().required(),
        generateTokens: Joi.boolean().required(),
        tokenId: Joi.number().required(),
        tokenPrice: Joi.number().required(),
        tokenQuantity: Joi.number().required(),
        imageUrl: Joi.string().required(),
        propertyType: Joi.string().optional(),
        rentalPrice: Joi.number().optional(),
        rentDate: Joi.string().optional(),
        walletAddress: Joi.string().required(),
    })
}

const updatePropertyStatus = {
    body: Joi.object().keys({
        tokenId: Joi.number().required(),
        isAddedMarketplace: Joi.boolean().optional(),
        remainingQuantity: Joi.number().optional(),
    })
}

const updateRentDate= {
    body: Joi.object().keys({
        tokenId: Joi.number().required(),
        rentDate: Joi.string().optional()
    })
}


module.exports = {
    createProperty,
    updatePropertyStatus,
    updateRentDate
}