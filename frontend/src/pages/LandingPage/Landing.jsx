
import { Link } from 'react-router-dom'
import './LandingPage.css'

const Landing=()=>{
    return (
        <div className="landingPageContainer">
            {/* navbar */}
             <nav>
                 <div className="navHeader">
                    <h2>VideoCall with Your PeeRs</h2>
                 </div>
                 <div className="navList">
                    <p>Join As Guest</p>
                    <p>Register</p>
                    <div role='button'>
                        <p>Login</p>
                    </div>
                 </div>
             </nav>
             {/* main container  */}
             <div className="ladingMainContainer">
                <div>
                    <h1><span style={{color:'#D97500'}}>Connect</span> with your loved Ones</h1>
                    <p>Cover a long distance With PeeRs</p>
                    <div role='button'>
                        <Link to={'/home'}>Get Started</Link>
                    </div>
                </div>
                <div>
                    <img src='/mobile.png'/>
                </div>
             </div>
        </div>
    )
}

export default Landing 