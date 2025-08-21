import {Router} from 'express';
import users from '../models/user.js'
import { createUserSchema, idSchema, updateUserSchema } from '../schemas/user.js'
import autenticateToken from '../middleware/login.js'

import checkAutoProfile from '../helpers/checkAuto.js'

const path = '/usuarios'
import checkRoles from '../helpers/checkRoles.js'
const router = Router();

router.get('/SeeUsers',autenticateToken, async (req, res)=>{
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    const result = await users.getUsers(skip, limit,page)
    if(result.success){
        res.json({
            result
        })
    }else{
        res.json({
            result
        })
    }
    

})
router.get('/profile/:id', autenticateToken, async (req, res)=>{
    const action = "seeOneUser"
    const user = req.user
    const validRole = checkRoles(user, action)
    const id =req.params.id
    const validationResult = idSchema.validate(id)
    if(validRole){
            if(validationResult.error !== null){
                const usuario = await users.findUser(id)
                res.json(usuario)
            }else{
                res.json({
                    error: validationResult.error,
                    httpCode: 400,
                    errorMessage: 'Bad Request'
                })
            }
    }else{
        res.json({
            success: false,
            httpCode: 403,
            error: 'Sin permisos para realizar la acción'
        })
    }


    
})
router.put('/userModify/:id', autenticateToken, async (req,res, next)=>{
    const body = req.body
    const action = "modifyMyProfile"
    const id =req.params.id
    const user = req.user
    const validRole = checkRoles(user, action)
    const validAuto = checkAutoProfile(user, id)
    const validationResult = updateUserSchema.validate(id)
    
    if(!validAuto && user.roles!='superAdminRole'){
        return res.json({
            success: false,
            httpCode: 403,
            error: 'Sólo los administradores pueden modificar perfiles que no son suyos'
            
        })
    }
    if(validRole || validAuto){

        if(validationResult.error!== null){
            const result = await users.updateUser(body, id)
            if(result.error){
                res.json(result)
            }else{
                res.json(result)
            }
        }else{
            res.json({
                error: validationResult.error,
                httpCode: 400,
                errorMessage: 'Bad Request'
            })
        }

    }else{
        res.json({
        success: false,
        httpCode: 403,
        error: 'Sin permisos para realizar la acción'
        })
    }

})

router.post('/createANewUser', async (req,res)=>{
    const body = req.body

    const validationResult = createUserSchema.validate(body)
    if(validationResult.error === null || !validationResult.error){
        const result = await users.createUser(body)
        if(result.success){
            res.status(200).json({result})
        }else{
            res.status(result.httpCode).json({result})
        }
    }else{
        const exit={
            success: false,
            message: "Por favor, verifique que está ingresando sus datos correctamente",
            error: 'bad request',
            httpCode: 400,
            attribute: validationResult.error || 'Error desconocido'
        }
        res.status(400).json(
            exit
        )
    }
    
})

router.delete('/deleteUser/:id', autenticateToken, async (req,res)=>{
    const action = "deleteUser"
    const id =req.params.id
    const user = req.user
    const validRole = checkRoles(user, action)
    const validAuto = checkAutoProfile(user, id)
    const validationResult = idSchema.validate(id)
        if(!validAuto && user.roles!='superAdminRole'){
        return res.json({
            success: false,
            httpCode: 403,
            error: 'Sólo los administradores pueden eliminar perfiles que no son suyos'
            
        })
    }
    if(validRole || validAuto){
        if(validationResult.error!== null){
            const result = await users.deleteUser(id)
            if(result.error){
                res.json(result)
            }else{
                res.json(result)
            }
        }else{
            res.json({
                error: validationResult.error,
                httpCode: 400,
                errorMessage: 'Bad Request'
            })
        }

    }else{
        res.json({
        success: false,
        httpCode: 403,
        error: 'Sin permisos para realizar la acción'
        })
    }
})

router.put('/unactiveUser/:id', autenticateToken, async (req,res)=>{
    const action = "invalidateUser"
    const id =req.params.id
    const user = req.user
    const validRole = checkRoles(user, action)
    const validAuto = checkAutoProfile(user, id)
    const validationResult = idSchema.validate(id)
        if(!validAuto && user.roles!='superAdminRole'){
        return res.json({
            success: false,
            httpCode: 403,
            error: 'Sólo los administradores pueden invalidar perfiles que no son suyos'
        })
    }
    if(validRole || validAuto){
        if(validationResult.error!== null){
            const result = await users.invalidateUser(id)
            if(result.error){
                res.json(result)
            }else{
                res.json(result)
            }
        }else{
            res.json({
                error: validationResult.error,
                httpCode: 400,
                errorMessage: 'Bad Request'
            })
        }

    }else{
        res.json({
        success: false,
        httpCode: 403,
        error: 'Sin permisos para realizar la acción'
        })
    }
})


export default router