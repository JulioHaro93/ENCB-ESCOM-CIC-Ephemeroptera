import User from '../db/user.js'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'


const users ={

    getUsers: async (skip, limit, page)=>{
        
        const usuarios = await User.find().select('-password').skip(skip).limit(limit)
        const totalDocuments = await User.countDocuments()
        if(usuarios.length >0){
            return{
                success: true,
                users: usuarios,
                page,
                limit,
                totalDocuments,
                totalPages: Math.ceil(totalDocuments / limit)
            }
        }else{
            return{
                success: false,
                error: 404,
                message: "Error, no se encontró ningún usuario"
            }
        }
    },
    createUser: async (body)=>{

        const userExists = await User.findOne({$or: [
        { correo: body.correo },
        { nickname: body.nickname }]}).select('-password')
        if(userExists){
            return{
                success: false,
                httpCode: 400,
                code: 'Bad request',
                message: 'El usuario ya ha sido registrado'
            }
        }else{
            const salt = bcrypt.genSaltSync(10);
            body.password = bcrypt.hashSync(body.password, salt);

                const user = await User.create(body);
                if(user){
                    const usuarito = {
                        nombre: user.nombre,
                        correo: user.correo,
                        activo: user.activo,
                    }
                    return {
                        success: true,
                        httpCode: 200,
                        message: 'Usuario creado con éxito',
                        ususario: usuarito
                    };
                }else{
                    return {
                        success: false,
                        httpCode: 500,
                        error: "Internal Error Server",
                        message: "No fue posible crear al usuario \nPor problemas con el servidor"
                    };
                }
        }

    },
    findUser: async (id) =>{
        const usuario = await User.findOne({_id:id}).select('-password')
        if(usuario.nombre){
            return usuario
        }else{
            return{
                error: 'Usuario no encontrado',
                httpCode: 404,
                errorMessage: "No existe el usuario"
            }
        }
        
    },
    updateUser: async (body, id)=>{
        const updatedUser = await User.findByIdAndUpdate(id,{ $set: body },{ new: true })
        const user = await User.findOne({_id:id}).select('-password')
        if (!updatedUser) {
            return{
                error: "usuario no encontrado",
                httpCode: 404,
                errorMessage: "Not found"
            }
        }else{
            return {user}
        }

    },
    invalidateUser: async (id)=>{
        const body = {
                activo: false,
                roles: "noRole"
            }
        const updatedUser = await User.findByIdAndUpdate(id,{ $set: body },{ new: true })
        const user = await User.findOne({_id:id}).select('-password')
        if (!updatedUser) {
            return{
                error: "usuario no encontrado",
                httpCode: 404,
                errorMessage: "Not found"
            }
        }else{
            return {user}
        }
    },
    deleteUser: async(id)=>{
         const deletedUser = await User.findByIdAndDelete(id)

        if (!deletedUser) {
            return {
                success: false,
                httpCode: 404,
                error: 'Usuario no encontrado'
            }
        }

        return {
            success: true,
            httpCode: 200,
            message: 'Usuario eliminado correctamente',
            user: deletedUser
        }
    }
}

export default users;