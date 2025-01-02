import express from 'express'
import cors from 'cors'
import {Server} from 'socket.io'
import mongoose from 'mongoose'
import {createServer} from 'http'

import UserRouter from './routes/UserRouter.js'
import {connectToSocket} from './controllers/socketManager.js'


const app=express()
const server=createServer(app)
const io=connectToSocket(server)

const port=3000;

//middlewares
app.use(cors())
app.use(express.json({limit:'40kb'}))
app.use(express.urlencoded({extended:true}))

app.use('/api/v1/users',UserRouter)

app.get('/',(req,res)=>{
    res.send('root is working')
})

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/zoom')
}
main().then(()=>{
    console.log('Connected to Database')
}).catch((err)=>{
    console.log(err)
})

server.listen(3000,()=>{
    console.log('Server is running on port 3000')
})