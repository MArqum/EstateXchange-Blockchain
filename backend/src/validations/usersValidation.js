const {Joi} = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const userSignIn = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })
}



const userSignUp = {
    body: Joi.object().keys({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().optional(),
        zip: Joi.string().optional(),
    })
}



const userView = {
    params: {
        id: Joi.objectId().required()
    }
}


module.exports = {
    userSignIn,
    userSignUp,
    userView,
}