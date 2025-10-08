import {Router} from 'express';
import imagesControler from '../models/imageData.js'
import { uploadPhoto, createImageURL, imgId} from '../schemas/images.js'
import autenticateToken from '../middleware/login.js'
import checkAutoProfile from '../helpers/checkAuto.js'
const path = '/imageInfo'
import checkRoles from '../helpers/checkRoles.js'
const router = Router()

router.get(`${path}/:id`, autenticateToken, async (req, res)=>{
    const idImage = req.params.id
    const validationResult = imgId.validate({idImage})
    if(validationResult.error===null){
        const imagenes = await imagesControler.getImageData(idImage)
        if(imagenes){
            res.json({imagenes})
        }
    }else{
        res.json({
            error: validationResult.error,
            httpCode: 400,
            errorMessage: 'Bad Request'
        })
    }
})

router.post(`${path}/createImageData/:idImage`, autenticateToken, async (req,res)=>{
    const idImage = req.params.idImage
    const action ='createImageData'
    const user = req.user
    const validRole = checkRoles(user, action)
    const validAuto = checkAutoProfile(user, user.id)
    const validationResult = createImageURL.validate({idImage})
    if(validAuto || validRole){
        if(validationResult.error===null){
            const result = await imagesControler.createImageData(action, idImage, user)
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

router.put(`${path}/modifyImageData/:idImage`, autenticateToken, async (req,res)=>{
    const idImage = req.params.idImage
    const newData = req.body
    const action ='modifyImageData'
    const user = req.user
    const validRole = checkRoles(user, action)
    const validAuto = checkAutoProfile(user, user.id)
    const validationResult = createImageURL.validate({idImage})
})

export default router