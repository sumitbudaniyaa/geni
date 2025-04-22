import './hero.css'
import { Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
 
const Hero = () => {

    const navigate = useNavigate();

    return(
       <div className="hero">
           <div className="helped-box">
               <p>Helped 200+ people</p>
           </div>
           <div className="hero-desc">
             <h1>One stop solution for people looking for career guidance</h1>
           </div>

           <div className="geni-box"  onClick={()=>{navigate('/choose')}}>
                <h3>Interact with Geni...</h3>
                <button><Send strokeWidth={2.5} /></button>
           </div>
       </div>
    )
}

export default Hero;