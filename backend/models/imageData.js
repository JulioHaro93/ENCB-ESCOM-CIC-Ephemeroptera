import ImageData from '../db/imageData.js';
import Images from '../db/images.js';

const imagesControler = {
    getImageData: async (idImage)=>{

        const imageData = await ImageData.findOne({image:idImage}).catch(err=>console.log(err))
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
    createImageData: async (body, idImage,user) => {

        const image = await Images.findOne({ _id: idImage });
        if (!image) {
            return {
                success: false,
                errorMessage: 'No se encontró la imagen',
                httpCode: 400,
                error: 'bad request'
            };
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