import {Schema, model} from 'mongoose'

const logSchema = Schema({
    action: {type: String},
    url: {type: String},
    method:{type: String},
    date: {type :Date, default: new Date()},
    user: {type: Schema.Types.ObjectId, ref:'Usuarios'}
},{versionKey: false})

logSchema.virtual('id').get(()=>{
    return this._id
})
const Logs = model('Logs', logSchema)

export default Logs