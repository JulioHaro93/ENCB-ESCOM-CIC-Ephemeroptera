import Joi from 'joi'

const createImageURL = Joi.object().keys({

    key: Joi.string(),
    user: Joi.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    url: Joi.string(),
    tipo: Joi.string()
})

const uploadPhoto = Joi.object().keys({
    key: Joi.string()
})

export {createImageURL, uploadPhoto}