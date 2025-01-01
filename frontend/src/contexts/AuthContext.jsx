import { createContext, useContext, useState } from "react";
import axios from 'axios'
import httpStatus from 'http-status'
import { useNavigate } from 'react-router-dom'

export const AuthContext=createContext({})

const client=axios.create({
  baseURL:"http://localhost:3000/api/v1/users"
})

export const AuthProvider=({children})=>{
    const authContext=useContext(AuthContext)

    const [userData,setUserdata]=useState(authContext)

    const router=useNavigate('/login') 

     const handleRegister=async(username,email,password)=>{
        try{
              let request=await client.post('/register',{
                username,email,password
              })
              if(request.status===httpStatus.CREATED){
                return request.data.message
              }
        }catch(err){
          console.log(err)
        }
     }
     const handleLogin=async(email,password)=>{
        try{
               let request= await client.post('/login',{
                 email,password
               })
               if(request.status===httpStatus.OK){
                  localStorage.setItem('token',request.data.token)
                  router('/home')
               }
        }catch(err){
           console.log(err)
        }
     }

    const data={
      userData,setUserdata,handleRegister,handleLogin
    }

    return (
      <AuthContext.Provider value={data}>
        {children}
      </AuthContext.Provider>
    )
}