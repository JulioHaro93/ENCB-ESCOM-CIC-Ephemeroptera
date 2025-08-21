import jwt from 'jsonwebtoken'
import users from '../models/login.js'
import bcrypt from 'bcrypt'
import config from '../config/index.js'

const autenticateToken = async (req, res, next) => {
    const jwtkey = config.base.privateKey
    const authTokenHeader = req.headers['authorization']
    
    if (!authTokenHeader) {
        return res.status(401).json({
            success: false,
            error: 'Sin autorización para realizar la acción'
        });
    }
    
    if (!jwtkey) {
        return res.status(500).json({
            success: false,
            error: 'No se ha configurado la clave secreta del JWT'
        });
    }
     
    const token = authTokenHeader.split(' ')[1]

    try {
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Sin autorización para realizar la acción'
            });
        }
        
        const decoded = jwt.verify(token, jwtkey)
        
        if (decoded) {
            req.user = decoded
            next()
        } else {
            return res.status(401).json({
                success: false,
                error: 'No hay usuario en el JWT'
            });
        }
    } catch (err) {
        return res.status(401).json({
            success: false,
            error: err.message || 'Error en la autenticación del token'
        })
    }
}


export default autenticateToken