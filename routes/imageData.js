import {Router} from 'express';
import imagesControler from '../models/imageData.js'
import {getImageData, createImageData, modifyImageData} from '../schemas/imageData.js'
import autenticateToken from '../middleware/login.js'
import checkAutoProfile from '../helpers/checkAuto.js'
const path = '/imageData'
import checkRoles from '../helpers/checkRoles.js'
const router = Router()

router.get(`${path}/:id`, autenticateToken, async (req, res)=>{
    const idImage = req.params.id
    const validationResult = getImageData.validate({idImage})
    const action ='getImageData'
    const validAuto = checkAutoProfile(req.user, req.user.id)
    const validRole = checkRoles(req.user, action)
    if(validAuto || validRole){

        if(validationResult.error==null){
        const imagenes = await imagesControler.getImageData(idImage)
        if(imagenes.success){
            res.json({imagenes})
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
            error: 'No autorizado',
            httpCode: 401,
            errorMessage: 'Unauthorized'
        })
    }
    
})

router.post(`${path}/createImageData/:idImage`, autenticateToken, async (req,res)=>{
    const body = req.body
    const idImage = req.params.idImage
    const action ='createImageData'
    const user = req.user.id
    const validRole = checkRoles(user, action)
    const validAuto = checkAutoProfile(user, user.id)
    const validationResult = createImageData.validate(body)

    if(validAuto || validRole){
        if(validationResult.error==null){
            const result = await imagesControler.createImageData(body,idImage,user)
            console.log("RESULT RESULT")
            console.log(result)
            res.json(result)
        }else{
            console.log("ERROR ERROR")
            console.log(validationResult.error)
            res.json({
                    error: validationResult.error,
                    httpCode: 400,
                    errorMessage: 'Bad Request'
                })
        }
    }else{
        res.json({
            error: 'No autorizado',
            httpCode: 401,
            errorMessage: 'Unauthorized'
        })
    }
})

router.put(`${path}/modifyImageData/:idImage`, autenticateToken, async (req,res)=>{
    const idImage = req.params.idImage
    const newData = req.body
    const action ='modifyImageData'
    const user = req.user
    const validRole = checkRoles(user, action)
    const validAuto = checkAutoProfile(user, user.id)
    const validationResult = modifyImageData.validate(newData)
    if(validAuto || validRole){
        if(validationResult.error==null){
            const result = await imagesControler.modifyImageData(idImage, newData)
            res.json(result)
        }else{
            res.json({
                    error: validationResult.error,
                    httpCode: 400,
                    errorMessage: 'Bad Request'
                })
        }
    }else{
            res.json({
                error: 'No autorizado',
                httpCode: 401,
                errorMessage: 'Unauthorized'
            })
        }
})

export default router