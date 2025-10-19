import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const env = process.env.NODE_ENV || '.env'
const envPath = path.resolve(__dirname, `../.envs/${env}`)

dotenv.config({ path: envPath })

const config = { 
    base: {
        privateKey: process.env.JWT_KEY
    }
}

export default config;
