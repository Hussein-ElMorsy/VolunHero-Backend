import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import {fileURLToPath} from 'url'
import initApp from './src/index.router.js'

dotenv.config()
const app = express()


const __direname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path:path.join(__direname,"./config/.env")})
const port = process.env.PORT || 8000

initApp(app,express);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))