import './pricing.css'

const Pricing = () =>{
    return(
            <div className="pricing" id="pricing">
                <h4>
                   Pricing
                </h4>
                 <div className="pricecard individual">
                  <h3>Individual Consultation</h3>
                  <p>For individual use</p>
                  <span>$5 <code>/consultation</code></span>
                  <button>Book</button>
                 </div>
                 <div className="pricecard corp">
                 <h3>Corporate Consultation</h3>
                  <p>For schools, colleges etc.</p>
                  <span>$220 </span>
                  <code>/50 consultatoins</code>
                  <button>Book</button>
                 </div>
            </div>
    )
}

export default Pricing;

