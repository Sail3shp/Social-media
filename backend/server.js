import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import { connectDb } from './config/connectDb.js'
dotenv.config()
const PORT = process.env.PORT || 9256
const app = express()

app.use(cookieParser())

app.listen(PORT,() => {
    connectDb()
    console.log(`server is running in ${PORT}`)
})
