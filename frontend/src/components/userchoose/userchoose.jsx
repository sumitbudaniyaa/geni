import { useState } from 'react';
import './userchoose.css'
import {useNavigate} from 'react-router-dom'

const UserChoose = () =>{

    const navigate = useNavigate();
    const [isChosen,setisChosen] = useState("")

    return(
          <div className="choose">
                       <h4>I am a</h4>
                       <div className="checkers">
                        <button  className={isChosen === "student" ?'student active'  : 'student'} onClick={()=>setisChosen("student")}>Student</button>
                        <button className={isChosen === "worker" ?'worker active'  : 'worker'} onClick={()=>setisChosen("worker")}>
                           Working Professional
                        </button>
                       </div>
                       <button onClick={()=>{
                        if(isChosen === 'student')
                        { navigate('/student-interaction') }
                        else if(isChosen === 'worker')
                        {
                            navigate('/working-professional-interaction')
                        }}}>Next</button>
          </div>
    )
}

export default UserChoose; 