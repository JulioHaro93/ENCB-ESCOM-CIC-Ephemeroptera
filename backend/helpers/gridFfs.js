import mongoose from 'mongoose';
import { GridFsStorage } from 'multer-gridfs-storage';
import multer from 'multer';

const mongoURI = process.env.MONGODB_URI2;

const storage = new GridFsStorage({
  url: mongoURI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => ({
    filename: `${Date.now()}-${file.originalname}`,
    bucketName: 'uploads',
    metadata: {
      user: req.user?._id || null,
      tipo: req.body.tipo || 'general',
    },
  }),
});

export const uploadGridFS = multer({ storage });
