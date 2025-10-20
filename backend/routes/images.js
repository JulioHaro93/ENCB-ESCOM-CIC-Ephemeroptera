import {Router} from 'express';
import mongoose from 'mongoose';
import imagesControler from '../models/images.js'
import { uploadPhoto, createImageURL, imgId} from '../schemas/images.js'
import autenticateToken from '../middleware/login.js'
import checkAutoProfile from '../helpers/checkAuto.js'
const pathh = '/images'
import checkRoles from '../helpers/checkRoles.js'
const router = Router()
import multer from 'multer'
import path from 'path'
import {uploadGridFS} from '../helpers/gridFfs.js'

const storageMemory = multer.memoryStorage();
const upload = multer({ storage: storageMemory }).single('file');

router.get(`${pathh}/userImagesGridFS/:fileId`,autenticateToken, async (req, res)=>{
    console.log("userImagesGridFS: Obtener imágenes del un usuario.")
    const fileId = req.params.fileId;
    console.log(fileId,'\n')
    const skip = parseInt(req.query.skip) || 0
    const limit = parseInt(req.query.limit) || 10
    const action = 'getImages'
    //const validRole = checkRoles(user, action)
    //const validAuto = checkAutoProfile(user, user.id)
    const validationResult = uploadPhoto.validate({fileId})
    if(validationResult){
        try{
         const downloadStream = await imagesControler.getImageStream(fileId);
        if (!downloadStream) {
            return res.status(404).json({
            success: false,
            message: "No se pudo recuperar el archivo"
            });
        }

        res.set("Content-Type", "image/jpeg");

        downloadStream.on("error", (err) => {
            console.error("Error en stream:", err);
            res.status(500).json({
            success: false,
            message: "Error al transmitir el archivo",
            error: err.message
            });
        });

        downloadStream.pipe(res);
        } catch (err) {
        console.error("Error en /userImagesGridFS:", err);
        res.status(500).json({
            success: false,
            message: "Error interno al obtener el archivo",
            error: err.message
        });
        }
    }})


router.get(`${pathh}/userImages/:userId`, autenticateToken, async (req,res)=>{
    const query = req.query
    const user = query.user
    const userId = req.params.userId
    const skip = parseInt(req.query.skip) || 0
    const limit = parseInt(req.query.limit) || 10
    const action = 'uploadImage'
        const url = await imagesControler.getImages(userId, skip, limit, action)
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

router.post(`${pathh}/uploadImage`, autenticateToken, upload, async (req,res)=>{

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

router.post(`${pathh}/uploadGridFS/:id`, autenticateToken,upload, async (req, res) => {
    const action ='uploadGridFs'
    const user = req.params.id
    const file = req.file
    //
    const validRole = checkRoles(user, action)
    const validAuto = checkAutoProfile(user, user.id)
    const validationResult = uploadPhoto.validate({user})
    console.log(user)
    const result = await imagesControler.uploadToGridFS(file, user, action)
    res.json(result)
})



router.get(`${pathh}/gridfs/:id`, async (req, res) => {
  try {
    const conn = mongoose.connection
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'uploads' })
    const fileId = new mongoose.Types.ObjectId(req.params.id)

    const files = await bucket.find({ _id: fileId }).toArray()
    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'Archivo no encontrado' })
    }

    res.set('Content-Type', files[0].contentType)
    bucket.openDownloadStream(fileId).pipe(res)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener la imagen' })
  }
})

export default router