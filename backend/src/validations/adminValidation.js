const {Joi} = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const adminSignIn = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })
}



const adminSignUp = {
    body: Joi.object().keys({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        address: Joi.string().required(),
    })
}



const adminView = {
    params: {
        id: Joi.objectId().required()
    }
}


module.exports = {
    adminSignIn,
    adminSignUp,
    adminView,
}