import dotenv from 'dotenv'
import path from 'path'
import {Server} from './server.js'
dotenv.config({path: path.resolve('./.envs', '.env')});

const server = new Server();

server.listen()