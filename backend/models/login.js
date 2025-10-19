import Usuarios from '../db/user.js'
import Logs from '../db/logs.js'
import jwt from 'jsonwebtoken'
import config from '../config/index.js'
import bcrypt from 'bcrypt'

const users = {
    logUser: async (correo, password, method) => {
    try {
        
        const usuario = await Usuarios.findOne({ correo });
        if (!usuario) {
            return { error: "Usuario no encontrado" };
        }
        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            return { error: "Contraseña incorrecta" };
        }

        await Logs.create({
            action: 'login',
            url: '',
            method: method,
            date: Date.now(),
            user: usuario._id
        });

        const token = jwt.sign(
            { id: usuario._id, correo: usuario.correo, roles: usuario.roles },
            config.base.privateKey,
            { expiresIn: "7d" }
        );
        const userToken = {
            name: usuario.nombre,
            correo: usuario.correo,
            roles: usuario.roles
        }
        return { user: userToken, token };

    } catch (err) {
        console.error(err);
        return { error: "Error en el login", detalle: err.message };
    }
}

}

export default users