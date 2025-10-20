import Joi from 'joi'

const createImageURL = Joi.object().keys({

    key: Joi.string(),
    user: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
    url: Joi.string(),
    tipo: Joi.string()
})

const uploadPhoto = Joi.object().keys({
    fileId: Joi.string(),
})

const imgId= Joi.object().keys({
    user: Joi.string().regex(/^[a-fA-F0-9]{24}$/)
})
export {createImageURL, uploadPhoto, imgId}