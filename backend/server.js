import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import { connectDb } from './config/connectDb.js'
import authRouter from './routes/auth.route.js'
import { errorHandler } from './controllers/error.controller.js'
dotenv.config()
const PORT = process.env.PORT || 9256
const app = express()

app.use(cookieParser())
app.use(express.json())
app.get('/check',(req,res) => {
    res.send('working normally')
})

app.use('/api/v1/auth',authRouter)

app.use(errorHandler)

app.listen(PORT,() => {
    connectDb()
    console.log(`server is running in ${PORT}`)
})
