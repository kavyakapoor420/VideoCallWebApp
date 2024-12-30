import express from 'express'
import { login, register } from '../controllers/AuthController'

const UserRouter=express.Router()

UserRouter.post('/login',login)
UserRouter.post('/register',register)


export default UserRouter