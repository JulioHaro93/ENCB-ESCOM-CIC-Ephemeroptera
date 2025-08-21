import { Schema, model } from 'mongoose'

const imageSchema = new Schema({
    key:{type: String},
    user: {type: Schema.Types.ObjectId, required : true},
    url: {type: String, required: true},
    tipo: {type: String, required: true}
},
{versionKey: false})

const Images = model('Images', imageSchema)

export default Images