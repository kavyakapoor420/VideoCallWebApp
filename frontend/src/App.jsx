
import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import LandingPage from './pages/LandingPage/Landing.jsx'
// import Authentication from './pages/Auth/Authentication.jsx'
import LoginSignup from './pages/Auth/LoginSignup.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import VideoMeet from './pages/VideMeetComponent/VideoMeeto.jsx'
import VideoMeetComponent from './pages/VideMeetComponent/VideoMeeto.jsx'

function App() {
  
  return (
    <>
       
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                  <Route path='/' element={<LandingPage/>}/>
                  <Route path='/login' element={<LoginSignup/>}/>
                  {/* <Route path='/:url' element={<VideoMeet/>}></Route> */}
                  <Route path='/:url' element={<VideoMeetComponent/>}/>
                </Routes>
              </AuthProvider>
        </BrowserRouter>
    </>
  )
}

export default App
