import ImageData from '../db/imageData.js';
import Images from '../db/images.js';
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import { Types } from 'mongoose';

let gfs;
mongoose.connection.once("open", () => {
  gfs = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
});


const imagesControler = {
    getImageData: async (idImage)=>{
        const imageData = await ImageData.findOne({image:idImage}).catch(err=>console.log(err))
        if(imageData){
            return{
                success: true,
                imageData
            }
        }else{
            try {
                if (!idImage)
                  return { success: false, message: "No se proporcionó el ID del archivo" };
            
                const file = await gfs
                  .find({ _id: new mongoose.Types.ObjectId(idImage) })
                  .toArray();
            
                if (!file || file.length === 0)
                  return { success: false, message: "Archivo no encontrado" };
                return file[0];
              } catch (err) {
                console.error("Error en getImageInfo:", err);
                return { success: false, message: err.message };
              }
        }
    },
    createImageData: async (body, idImage,user) => {

        let image = await Images.findOne({ _id: idImage });
        
        if (!image) {
            try {
                  
                const file = await gfs.find({ _id: new mongoose.Types.ObjectId(idImage) }).toArray();
            
                if (!file || file.length === 0){
                    return { 
                    success: false,
                    message: "Archivo no encontrado",
                    httpCode: 404,
                    error: 'not found' 
                }

                }else{
                    
                    const bodyData = {
                        ...body,
                        image: idImage,
                        user: user
                    };
                    const imageData = new ImageData(bodyData);

                    try {

                        const savedData = await imageData.save();
                        return {
                            success: true,
                            imageData: savedData
                        };
                    } catch (err) {
                        return {
                            success: false,
                            errorMessage: 'No se pudo guardar la información de la imagen',
                            httpCode: 500,
                            error: 'internal server error'
                        };
                    }
              }
            } catch (err) {
                console.error("Error en getImageInfo:", err);
                return {
                success: false,
                errorMessage: 'No se encontró la imagen',
                httpCode: 400,
                error: 'bad request'
            }
        }

        }

        const bodyData = {
            ...body,
            image: idImage,
            user: user
        };
        const imageData = new ImageData(bodyData);

        try {

            const savedData = await imageData.save();
            return {
                success: true,
                imageData: savedData
            };
        } catch (err) {
            return {
                success: false,
                errorMessage: 'No se pudo guardar la información de la imagen',
                httpCode: 500,
                error: 'internal server error'
            };
        }
    },
    modifyImageData: async (idImageData, newData)=>{
        const imageData = await ImageData.findOneAndUpdate({_id:idImageData}, newData, {new:true}).catch(err=>console.log(err))
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