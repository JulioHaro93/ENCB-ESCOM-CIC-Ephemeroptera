import Images from "../db/images.js";
import Usuarios from '../db/user.js'
import { getMimeType, validateMimeType } from "../helpers/mimetype.js";
import mongoose from "mongoose";
import { Types } from 'mongoose';
import { GridFSBucket } from "mongodb";
import crypto from 'crypto';
import path from 'path'

let gfs;
mongoose.connection.once("open", () => {
  gfs = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
});

const imagesController = {

  uploadToGridFS: async (file, user, action) => {
        if (!file) {
        return { success: false, message: 'No se recibió ningún archivo' };
        }

        const validMime = await validateMimeType(file.mimetype);
        if (!validMime.valid) {
            return { success: false, message: 'Tipo de archivo no permitido', mimeType: file.mimetype };
        }

     try {
        // Generar un _id para el archivo
        const fileId = new Types.ObjectId();
        const randomName = `${Date.now()}-${file.originalname}`;

        // Abrir upload stream con ese _id
        const uploadStream = gfs.openUploadStreamWithId(fileId, randomName, {
        contentType: file.mimetype,
        metadata: { user, tipo: action }
        });

        uploadStream.end(file.buffer);

        // Esperar que termine
        await new Promise((resolve, reject) => {
        uploadStream.on('finish', resolve);
        uploadStream.on('error', reject);
        });

        // Guardar en la colección de metadata
        const imageDoc = await Images.create({
        filename: randomName,
        fileId: fileId, // ahora sí tiene _id
        user:user,
        tipo: action
        });
        const newImageUser = await Usuarios.findByIdAndUpdate(
            user,
            { $push: { images: fileId } },
            { new: true })
            
        console.log(newImageUser)
        if(newImageUser){return { success: true, message: 'Archivo subido correctamente', image: imageDoc };}
        
    } catch (err) {
        console.error('Error en uploadToGridFS:', err);
        return { success: false, message: 'Error al subir el archivo', error: err };
        }
    },

  getImageStream: async (fileId) => {
    try {
      console.log("File Id;:")
      console.log(fileId)
      if (!fileId) return {
        success: false,
        message: "No se proporcionó el ID del archivo" }
      
      const downloadStream = await gfs.openDownloadStream(new mongoose.Types.ObjectId(fileId))
      return downloadStream 

    } catch (err) {
      console.error("Error en getImageStream:", err);
      return { 
        success: false, 
        message: "Error al obtener el archivo", 
        error: err };
    }
  },
  getImageInfo: async (fileId) => {
  try {
    if (!fileId)
      return { success: false, message: "No se proporcionó el ID del archivo" };

    const file = await gfs
      .find({ _id: new mongoose.Types.ObjectId(fileId) })
      .toArray();

    if (!file || file.length === 0)
      return { success: false, message: "Archivo no encontrado" };
    return file[0];
  } catch (err) {
    console.error("Error en getImageInfo:", err);
    return { success: false, message: err.message };
  }
},

  getImages: async (userId, skip = 0, limit = 10, page = 1, tipo = null) => {
    try {
      const query = { user: userId };
      if (tipo) query.tipo = tipo;

      const images = await Images.find(query).skip(skip).limit(limit).lean();
      const totalDocuments = await Images.countDocuments(query);

      return {
        success: true,
        images,
        page,
        limit,
        totalDocuments,
        totalPages: Math.ceil(totalDocuments / limit),
      };
    } catch (err) {
      console.error("Error en getImages:", err);
      return { success: false, message: "Error al obtener imágenes", error: err };
    }
  },

  deleteImage: async (fileId) => {
    try {
      if (!fileId) return { success: false, message: "No se proporcionó el ID del archivo" };

      // Eliminar de GridFS
      await gfs.delete(new mongoose.Types.ObjectId(fileId));

      // Eliminar metadata
      await Images.deleteOne({ fileId: fileId });

      return { success: true, message: "Archivo eliminado correctamente" };
    } catch (err) {
      console.error("Error en deleteImage:", err);
      return { success: false, message: "Error al eliminar el archivo", error: err };
    }
  },

};

export default imagesController;
