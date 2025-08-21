import bcrypt  from "bcrypt"
import User from '../middleware/login.js'
import {Router} from 'express';

import users from '../models/login.js'; 
import { createUserSchema } from '../schemas/user.js';
const path = '/login'
const router = Router();

router.post(path,  async (req,res)=>{

    const {correo, password} = req.body
    const log = await users.logUser(correo, password, 'logs/create')
    if(log.user){
        res.json({
            success: true,
            httpStatus: 200,
            user: log.user,
            token: log.token
        })
    }else{
        res.body={
            success: false,
            httpStatus: 400,
            error: log
        }
    }
})

export default router
