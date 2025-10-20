import { Schema, model } from 'mongoose'

const imageSchema = new Schema({
  filename: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tipo: { type: String},
  fileId: { type: Schema.Types.ObjectId},
  uploadDate: { type: Date, default: Date.now },
}, { versionKey: false })

const Images = model('Images', imageSchema)
export default Images
