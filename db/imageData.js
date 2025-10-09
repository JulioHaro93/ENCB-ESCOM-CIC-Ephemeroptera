import { Schema, model } from 'mongoose'

const imageDataSchema = new Schema({
    image: {type: Schema.Types.ObjectId, required : true},
    description: {type: String},
    order: {type: String},
    fammily: {type: String},
    location: {type: String},
    season: {type: String},
    recolector: {type: String},
    date: {type: Date, default: Date.now},
    user: {type: Schema.Types.ObjectId, required : true},
    vegetation: {type: String},
    maduration: {type: String},
    bmwp: {type: Number, default: 0}
},
{versionKey: false})

const ImageData = model('ImageData', imageDataSchema)

export default ImageData