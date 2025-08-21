import Joi from 'joi'

const rolesSchema = Joi.object({
    total: Joi.boolean().required(), // total debe ser true o false
    roles: Joi.array().items(Joi.string()).required() // roles es un array de strings
}).required();


const idSchema = Joi.object({
    id: Joi.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
})
const createUserSchema = Joi.object().keys({
    nombre: Joi.string(),
    correo: Joi.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    password: Joi.string().min(6).max(15),
    institution: Joi.string(),
    address: Joi.string(),
    activo: Joi.bool(),
    roles: Joi.string(),
    nickname: Joi.string().required()
})

const updateUserSchema = Joi.object().keys({
    nombre: Joi.string(),
    correo: Joi.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    institution: Joi.string(),
    address: Joi.string(),
    activo: Joi.bool(),
    nickname: Joi.string()
})

export {createUserSchema, idSchema, updateUserSchema}