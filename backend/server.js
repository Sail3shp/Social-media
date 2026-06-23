import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { connectDb } from './config/connectDb.js'
import authRouter from './routes/auth.route.js'
import postRouter from './routes/post.route.js'
import chatRouter from './routes/chat.router.js'
import notificationRouter from './routes/notification.route.js'
import { errorHandler } from './controllers/error.controller.js'
import path from 'node:path'
dotenv.config()


process.on('uncaughtException',(error) => {
    console.log(error.name + ':' + error.message)
    console.log('uncaught exception occurd.Shutting down...')
    server.close(()=>{
        process.exit(1)
    })
})

const PORT = process.env.PORT || 9256
const __dirname = path.resolve()
const app = express()
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,
}))

app.use(cookieParser())
app.use(express.json({
    limit: '50mb'
}))
app.get('/check',(req,res) => {
    res.send('working normally')
})

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/post',postRouter)
app.use('/api/v1/notification',notificationRouter)
app.use('/api/v1/chat',chatRouter)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,"/frontend/dist")))
    
    app.get('/{*splat}',(req,res) => {
        res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
    })
}
app.use(errorHandler)

const server = app.listen(PORT,() => {
    connectDb()
    console.log(`server is running in ${PORT}`)
})

process.on('unhandledRejection',(error) => {
    console.log(error.name + ':' + error.message)
    console.log('unhandled rejection occurd.Shutting down...')
    server.close(()=>{
        process.exit(1)
    })
})
