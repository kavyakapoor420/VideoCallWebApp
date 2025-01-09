import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import httpStatus from 'http-status'
import UserModel from '../models/UserModel.js'
import MeetingModel from '../models/MeetingModel.js'


const JWT_SECRET="abcd"


export const register=async(req,res)=>{
   
    const {username,email,password}=req.body
    
    try{
        //check is user already exists in database so tell to login
         const existingUser=await UserModel.findOne({email})
         if(existingUser){
            return res.status(400).json({message:'User already exists'})
         }
         const hashedPassword=await bcrypt.hash(password,10)
         const newUser=new UserModel({
            username,email,password:hashedPassword
         })
         await newUser.save()

         return res.status(200).json({message:'User registered successfully'})

    }catch(err){
        return res.status(500).json({message:'internal server error'})
    }
}

export const login=async(req,res)=>{
    const {email,password}=req.body ;

    try{
          if(!email || !password){
            return res.status(400).json({message:'Please provide email and password'})
          }
          const user=await UserModel.findOne({email})
          if(!user){
            return res.status(400).json({message:'User does not exist'})
          }
          const isPasswordCorrect=await bcrypt.compare(password,user.password)
          if(isPasswordCorrect){
            let token=crypto.randomBytes(20).toString("hex")

            user.token=token;
            await user.save()
            return res.status(200).json({message:'User logged in successfully',token:token})
          }else{
            return res.status(400).json({message:'Invalid credentials'})
          }
    }catch(err){
        return res.status(500).json({message:'internal server error'})
    }
}

