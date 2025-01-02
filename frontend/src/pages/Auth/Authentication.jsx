import { useContext, useState } from 'react'
import './Auth.css'
import { AuthContext } from '../../contexts/AuthContext.jsx'


const Authentication = () => {

   const [formdata,setFormData]=useState({
     username:'',
     email:'',
      password:''
    })
    const [formState,setFormState]=useState(0) // 0 for login // 1 for register
    const [error,setError]=useState('')
    const [message,setMessage]=useState('')
    const [open,setOpen]=useState(false)
    
   // Destructure functions from AuthContext (login and register)
   const { handleRegister, handleLogin } = useContext(AuthContext);


   const handleinputChange=(e)=>{
     const {name,value}=e.target

      setFormData((prevState)=>(
       { ...prevState,[name]:value}
      ))
   }
 // handle authentication (login or register)
 const handleAuth=async()=>{
   const {username,email,password}=formdata

   try{
        if(formState===0){
          // logic for login
          const result=await handleLogin(email,password)
          setMessage(result)
          setOpen(true)
        }
        if(formState===1){
          // logic for register
          const result=await handleRegister(username,email,password)
          setMessage(result)
          setOpen(true)
          setFormState(0) // switch back to login after registeration
          setFormData({
            username:'',
            email:'',
            password:''
          })
        }
   }catch(err){
       setError(err.response?.data?.message || 'Something went wrong')
   }
 }
   

  return (
    <div className='auth-container'>
        <div className="auth-sidebar">
        <img
          src="https://source.unsplash.com/random?wallpapers"
          alt="background"
          className="auth-background-image"
        />
        </div>
        <div className="auth-form-container">
             <div className="auth-buttons">
              <button className={`auth-toggle-button ${formState===0 ? 'active' : ''}`}
              onClick={()=>setFormState(1)}>
                  SignUp
              </button>
             </div>
        </div>
        <form className='auth-form' onSubmit={(e)=>e.preventDefault()}>
              {
                formState===1 && (
                    // if it is signup form then ask user to fill username in form 
                  <input type='text' 
                  className='auth-input' 
                  placeholder='enter your Username' 
                  value={formdata.username}
                  onChange={handleinputChange}
                  />
                  
                  )}

                  <input type='text'
                    className='auth-input'
                    placeholder='enter your email'
                    name='email'
                  />
                  <input type='password'
                    className='auth-input'
                    placeholder='enter your password'
                    name='password'
                  />
                   {/* if any error in form submission then show error message */}
                    {
                      error && <p classname='auth-error'>
                        {error}
                      </p>
                    }
                  {/* form submit button */}
                  <button type='button' className='auth-submit-button' onClick={handleAuth}>
                     {formState===0  ? 'Login':"SignUp"}
                  </button>
        </form>
        {/* snackBar or message display after registeration */}
         { 
         open && <div className="auth-snackbar">
          {message}
          </div>
          }
    </div>
  )
}

export default Authentication