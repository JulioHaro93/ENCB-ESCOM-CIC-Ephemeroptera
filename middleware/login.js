import jwt from 'jsonwebtoken'
import users from '../models/login.js'
import bcrypt from 'bcrypt'
import config from '../config/index.js'


const autenticateToken = async (req, res, next) =>{
    const jwtkey = config.base.privateKey
    const authTokenHeader =  req.headers['authorization']
    const token = authTokenHeader.split(' ')[1]

    try{
        if(!token){
            req.status = 401,
            req.body = {
                success: false,
                error: 'Sin autorización para realizar la acción'
            }
            return false
        }
        const decoded = jwt.verify(token, jwtkey)
        console.log(decoded)
        if(decoded){
            req.user = decoded
            next()
        }else{
            res.status = 401
            res.body ={
                success: false,
                error: 'No hay usuario en el JWT'
            }
            next()
        }
    }catch(err){
        res.status = 401
        res.body = {
            success: false,
            error: err
        }
        return false
    }
    
    
}

export default autenticateToken