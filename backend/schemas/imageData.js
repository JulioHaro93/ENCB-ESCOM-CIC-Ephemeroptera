import Joi from 'joi'

const createImageData = Joi.object().keys({

    image: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
    description: Joi.string().allow(''),
    order: Joi.string().allow(''),
    family: Joi.string().allow(''),
    location:Joi.string().allow(''),
    season: Joi.string().allow(''),
    recolector: Joi.string().allow(''),
    user: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
    vegetation: Joi.string().allow(''),
    maduration: Joi.string().allow(''),
    bmwp: Joi.number().integer().min(0)
})

const getImageData = Joi.object().keys({
    idImage: Joi.string().regex(/^[a-fA-F0-9]{24}$/)
})

const modifyImageData = Joi.object().keys({

    description: Joi.string().allow(''),
    order: Joi.string().allow(''),
    fammily: Joi.string().allow(''),
    location:Joi.string().allow(''),
    season: Joi.string().allow(''),
    recolector: Joi.string().allow(''),
    vegetation: Joi.string().allow(''),
    maduration: Joi.string().allow(''),
    bmwp: Joi.number().integer().min(0)
})

export {createImageData, getImageData, modifyImageData}