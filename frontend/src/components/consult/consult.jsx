import './consult.css'

const Consult = () =>{
    return(
         <div className="consult">
            <h4>Consultation Form</h4>
            <input type="text" placeholder='Name'/>
            <input type="text" placeholder='Occupation'/>
            <input type="email" placeholder='Email'/>
            <input type="number" placeholder='Phone Number'/>
            <input type="text" placeholder='Consultation regarding'/>

            <button>Get a call</button>
         </div>
    )
}

export default Consult;