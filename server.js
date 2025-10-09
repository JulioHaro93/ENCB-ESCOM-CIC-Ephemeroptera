import express from 'express'
import cors from 'cors'
import usuariosRoutes from './routes/user.js'
import loginRoutes from './routes/login.js'
import imagesRouter from './routes/images.js'
import imageDataRouter from './routes/imageData.js'
import bodyParser from 'body-parser';
import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


import dbConnection  from './db/db.js'

class Server{
    constructor(){
        this.app = express()
        this.middlewares()
        this.routes()
        this.port = process.env.PORT || 8080
        this.conectarDB()
    }
    routes(){
        this.app.use('/api',loginRoutes)
        this.app.use('/api', usuariosRoutes)
        this.app.use('/api', imagesRouter)
        this.app.use('/api', imageDataRouter)
        this.app.use(express.static(path.join(__dirname,'public')));
        this.app.use(express.static('images/uploads'));
        this.app.use('/images', express.static(path.join(__dirname, 'images')));
    }
    middlewares(){
        this.app.use(cors())
        this.app.use(express.json(), (req, res, next) => {
            //console.log('Body recibido:', req.body);
            next();
    })
    //this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
        //this.app.use(express.static('public'))

    }
    conectarDB(){
        dbConnection();
    }
listen(){
    this.app.listen(this.port,()=>{ 
        console.log('Servidor corriendo en el puerto ', this.port)
    })
    }
}

export {Server};