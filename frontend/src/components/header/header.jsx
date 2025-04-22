import './header.css'
import {useNavigate} from 'react-router-dom'


const Header = () =>{

    const navigate = useNavigate();

    return(
<header>   

<div className="header-logo" onClick={()=>navigate('/')}>
<img src="logo.png" alt="" />
    <h1>geni.</h1>

</div>



    <div className="header-btns">

        <ul>
        <li>
  <a href="#pricing">Pricing</a>
</li>

            <li onClick={()=>navigate('/trending-jobs')}>
                Trending Jobs
            </li>
        </ul>
        <button onClick={()=>navigate('/consult')}>
            Consult
        </button>
    </div>

</header>
    )
}


export default Header;