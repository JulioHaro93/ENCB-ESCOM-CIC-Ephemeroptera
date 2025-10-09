import {Router} from 'express';
import imagesControler from '../models/images.js'
import { uploadPhoto, createImageURL, imgId} from '../schemas/images.js'
import autenticateToken from '../middleware/login.js'
import checkAutoProfile from '../helpers/checkAuto.js'
const pathh = '/images'
import checkRoles from '../helpers/checkRoles.js'
const router = Router()
import multer from 'multer'
import path from 'path'
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, path.join('images', 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

const upload = multer({ storage })


router.get(`${pathh}/userImages`, autenticateToken, async (req,res)=>{
    const query = req.query
    const user = query.user
    const skip = parseInt(req.query.skip) || 0
    const limit = parseInt(req.query.limit) || 10
    const action = 'uploadImage'

        const url = await imagesControler.getImages(user, skip, limit, action)
        res.json({
            success: true,
            httpCode: 200,
            url
        })
})
    

router.get(`${pathh}/:id`, autenticateToken, async (req, res)=>{
    const idUser = req.params.id
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    const imagenes = await imagesControler.getImages(idUser, skip,limit,page)

    if(imagenes){
        res.json({imagenes})
    }
})

router.post(`${pathh}/uploadProfileImage`, autenticateToken, async (req,res)=>{
    const key = req.file.filename
    const action ='uploadPhoto'
    const user = req.user
    const validRole = checkRoles(user, action)
    const validAuto = checkAutoProfile(user, user.id)
    const validationResult = uploadPhoto.validate({key})

    if(validAuto || validRole){
        if(validationResult.error!==null){
            const result = await imagesControler.uploadProfile(action, key, user)
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
        success: false,
        httpCode: 403,
        error: 'Sin permisos para realizar la acción'
        })
    }

})

router.post(`${pathh}/uploadImage`, autenticateToken, upload.single('image'), async (req,res)=>{

    const key = req.file.filename
    const action ='uploadImage'
    const user = req.user
    const validRole = checkRoles(user, action)
    const validAuto = checkAutoProfile(user, user.id)
    const validationResult = uploadPhoto.validate({key})

    if(validAuto || validRole){
        if(validationResult.error!==null){
            const result = await imagesControler.uploadProfile(action, key, user)
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
        success: false,
        httpCode: 403,
        error: 'Sin permisos para realizar la acción'
        })
    }

})
router.post(`${pathh}/uploaddoc/:key`, autenticateToken, async (req,res)=>{

    const key = req.params.key
    const action ='uploaddoc'
    const user = req.user
    const validRole = checkRoles(user, action)
    const validAuto = checkAutoProfile(user, user.id)
    const validationResult = uploadPhoto.validate({key})

    if(validAuto || validRole){
        if(validationResult.error!==null){
            const result = await imagesControler.uploadPDF(action, key, user)
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
        success: false,
        httpCode: 403,
        error: 'Sin permisos para realizar la acción'
        })
    }

})





export default router