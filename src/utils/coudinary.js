import dotenv from 'dotenv'
import path from 'path'
import {fileURLToPath} from 'url'
import cloudinary from 'cloudinary';
const __direname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path:path.join(__direname,'../../config/.env')});

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true
})
export default cloudinary.v2;