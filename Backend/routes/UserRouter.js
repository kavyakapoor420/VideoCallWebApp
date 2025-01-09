import express from 'express'
import {  login, register } from '../controllers/AuthController.js'
import { addToHistory, getUserHistory } from '../controllers/UserController.js'

const UserRouter=express.Router()

UserRouter.post('/login',login)
UserRouter.post('/register',register)

UserRouter.route('/add_to_activity').post(addToHistory)
UserRouter.route('/get_all_activity').get(getUserHistory) ;

export default UserRouter