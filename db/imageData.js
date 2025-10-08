import { Schema, model } from 'mongoose'

const imageDataSchema = new Schema({
    image: {type: Schema.Types.ObjectId, required : true},
    description: {type: String},
    Order: {type: String},
    fammily: {type: String},
    location: {type: String},
    season: {type: String},
    recolector: {type: Schema.Types.ObjectId, ref: 'Usuarios'},
    date: {type: Date, default: Date.now},
    user: {type: Schema.Types.ObjectId, required : true},
    vegetation: {type: String},
    maduration: {type: String},
    bmpw: {type: Number, default: 0}
},
{versionKey: false})

const ImageData = model('ImagesData', imageDataSchema)

export default ImageData