
import { Schema, model } from 'mongoose'


const UserSchema = new Schema({
    nombre: {type: String, required:[true, 'El nombre es obligatorio']},
    correo:{type: String, required: [true,'El correo es obligatorio'], unique: true},
    password:{type: String, required:true},
    activo: {type: Boolean, default: true},
    img: {type: String},
    google:{type:Boolean, default: false},
    roles: {type: Object, default: {total: false, roles:[]}},
    registerDate : {type: Date, default: Date.now()},
    institution: {type: String},
    address: {type: String,},
    nickname: {type: String, unique: true}
}, {
    versionKey: false
})

const Usuarios = model('Usuarios', UserSchema);
 
export default Usuarios