import express from 'express'
import dotenv from 'dotenv'

import { connectDb } from './config/connectDb.js'
dotenv.config()

const PORT = process.env.PORT || 9256
const app = express()

app.listen(8848,() => {
    connectDb()
    console.log(`server is running in ${PORT}`)
})
