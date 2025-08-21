import express from 'express'
import cors from 'cors'
import usuariosRoutes from './routes/user.js'
import loginRoutes from './routes/login.js'
import imagesRouter from './routes/images.js'
import bodyParser from 'body-parser';



import dbConnection  from './db/db.js'

class Server{
    constructor(){
        this.app = express()
        this.middlewares()
        this.routes()
        this.port = process.env.PORT

        this.conectarDB()
        
    }
    routes(){
        this.app.use('/api', usuariosRoutes)
        this.app.use('/api',loginRoutes)
        this.app.use('/api', imagesRouter)
    }
    middlewares(){
        this.app.use(cors())
        this.app.use(express.json(), (req, res, next) => {
            //console.log('Body recibido:', req.body);
            next();
    })
        this.app.use(express.static('public'))

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