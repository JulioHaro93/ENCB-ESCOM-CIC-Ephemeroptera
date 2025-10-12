import { getMimeType, validateMimeType, validateFileExists } from "../helpers/mimetype.js"
import Images from "../db/images.js"
import fs from "fs/promises"
import copyAndRenameFile from '../helpers/images.js'
import path from "path"


const imagesControler = {
    getImages: async (id,skip, limit, page, action)=>{
            
            const images = await Images.find({user:id, tipo:'uploadImage'}).skip(skip).limit(limit)
            .catch(err=>console.log(err))
            const totalDocuments = await Images.countDocuments()
            if(images){
                
                return{
                    success: true,
                    images: images,
                    page,
                    limit,
                    totalDocuments,
                    totalPages: Math.ceil(totalDocuments / limit)
                }
            }else{
                return{
                    success: false,
                    error: 404,
                    message: "Error, no se encontró ningún usuario"
                }
            }
        },
    uploadProfile: async (action, key, user)=>{
        
        const urlPre = path.join('images', 'uploads', key)
        const url= path.join('images', 'users', 'profile')
        const exists = await validateFileExists(urlPre)
        if(!exists.success){
            return{exists}
        }
        if(!key){
            return{
                success: false,
                errorMessage: 'No se encontró la imagen',
                httpCode: 400,
                error: 'bad request'
            }
        }
        const mimeType = await getMimeType(urlPre)
        const validmime = await validateMimeType(mimeType)
        if(validmime.valid){
            const urlnew = await copyAndRenameFile(urlPre, url)
            if(urlnew.success){
                const body ={
                    key: urlnew.key,
                    user: user.id,
                    url: urlnew.newPath,
                    tipo: action
                }
                const result = await Images.create(body)
                if(result){
                    return{result}
                }else{
                    return{
                        success: false,
                        message: "Error al guardar el archivo",
                        httpCode: 500,
                        error: "Internal error server"
                    }
                }
            }else{
                return{
                    success: false,
                    message: "Error al eliminar el archivo",
                    httpCode: 500,
                    error: "Internal error server"
                }
            }
            
        }else{
            try {
                await fs.unlink(urlPre)
                return{
                    success: false,
                    message: "El archivo fue eliminado debido a que puede ser considerado potencialmente peligroso",
                    httpCode: 400,
                    error: "Bad Request"

                }
            } catch (err) {
                return{
                    success: false,
                    message: "Error al eliminar el archivo",
                    httpCode: 500,
                    error: "Internal error server"
                }
            }
        }
        
    },
    uploadImage:async (action, key, user)=>{
        
        const urlPre = path.join('images', 'uploads', key)
        const url= path.join('images', 'users', 'colections')
        const exists = await validateFileExists(urlPre)
        if(!exists.success){
            return{exists}
        }
        if(!key){
            return{
                success: false,
                errorMessage: 'No se encontró la imagen',
                httpCode: 400,
                error: 'bad request'
            }
        }
        const mimeType = await getMimeType(urlPre)
        const validmime = await validateMimeType(mimeType)
        if(validmime.valid){
            const urlnew = await copyAndRenameFile(urlPre, url)
            if(urlnew.success){
                const body ={
                    key: urlnew.key,
                    user: user.id,
                    url: urlnew.newPath,
                    tipo: action
                }
                const result = await Images.create(body)
                if(result){
                    return{result}
                }else{
                    return{
                        success: false,
                        message: "Error al guardar el archivo",
                        httpCode: 500,
                        error: "Internal error server"
                    }
                }
            }else{
                return{
                    success: false,
                    message: "Error al eliminar el archivo",
                    httpCode: 500,
                    error: "Internal error server"
                }
            }
            
        }else{
            try {
                await fs.unlink(urlPre)
                return{
                    success: false,
                    message: "El archivo fue eliminado debido a que puede ser considerado potencialmente peligroso",
                    httpCode: 400,
                    error: "Bad Request"

                }
            } catch (err) {
                return{
                    success: false,
                    message: "Error al eliminar el archivo",
                    httpCode: 500,
                    error: "Internal error server"
                }
            }
        }
        
    },
    uploadPDF:async (action, key, user)=>{
        
        const urlPre = path.join('images', 'uploads', key)
        const url= path.join('images', 'users', 'pdfs')
        const exists = await validateFileExists(urlPre)
        if(!exists.success){
            return{exists}
        }
        if(!key){
            return{
                success: false,
                errorMessage: 'No se encontró la imagen',
                httpCode: 400,
                error: 'bad request'
            }
        }
        const mimeType = await getMimeType(urlPre)
        const validmime = await validateMimeType(mimeType)
        if(validmime.valid){
            const urlnew = await copyAndRenameFile(urlPre, url)
            if(urlnew.success){
                const body ={
                    key: urlnew.key,
                    user: user.id,
                    url: urlnew.newPath,
                    tipo: action
                }
                const result = await Images.create(body)
                if(result){
                    return{result}
                }else{
                    return{
                        success: false,
                        message: "Error al guardar el archivo",
                        httpCode: 500,
                        error: "Internal error server"
                    }
                }
            }else{
                return{
                    success: false,
                    message: "Error al eliminar el archivo",
                    httpCode: 500,
                    error: "Internal error server"
                }
            }
            
        }else{
            try {
                await fs.unlink(urlPre)
                return{
                    success: false,
                    message: "El archivo fue eliminado debido a que puede ser considerado potencialmente peligroso",
                    httpCode: 400,
                    error: "Bad Request"

                }
            } catch (err) {
                return{
                    success: false,
                    message: "Error al eliminar el archivo",
                    httpCode: 500,
                    error: "Internal error server"
                }
            }
        }
        
    }
}

export default imagesControler