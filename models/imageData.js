import ImageData from '../models/imageData.js';
import Images from '../db/images.js';

const imagesControler = {
    getImageData: async (idImage)=>{
        const imageData = await ImageData.findOne({image:idImage}).populate('image').catch(err=>console.log(err))
        if(imageData){
            return{
                success: true,
                imageData
            }
        }else{
            return{
                success: false,
                error: 404,
                message: "Error, no se encontró información de la imagen"
            }
        }
    },
    createImageData: async (action, idImage, user)=>{
        const image = await Images.findOne({image:idImage})
        if(image){
            const bodyData ={
                image: idImage,
                user: image.user,
            }
        }else{
                return{
                    success: false,
                    errorMessage: 'No se encontró la imagen',
                    httpCode: 400,
                    error: 'bad request'
                }
            }
        const imageData = new ImageData(bodyData)
        const savedData = await imageData.save().catch(err=>console.log(err))
        if(savedData){
            return{
                success: true,
                imageData: savedData
            }
        }else{
            return{
                success: false,
                errorMessage: 'No se pudo guardar la información de la imagen',
                httpCode: 500,
                error: 'internal server error'
            }
        }
    },
    modifyImageData: async (idImage, newData)=>{
        const imageData = await ImageData.findOneAndUpdate({image:idImage}, newData, {new:true}).catch(err=>console.log(err))
        if(imageData){
            return{ 
                success: true,
                imageData
            }
        }else{
            return{
                success: false,
                error: 404,
                message: "Error, no se encontró información de la imagen"
            }
        }
        }
    }

export default imagesControler;