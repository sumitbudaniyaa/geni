import './App.css'
import Header from './components/header/header'
import { Routes, Route } from "react-router-dom";
import Hero from './components/hero/hero';
import Geni from './components/studentgeni/studentgeni';
import UserChoose from './components/userchoose/userchoose';
import StudGeni from './components/studentgeni/studentgeni';
import WorkerGeni from './components/workergeni/workergeni';
import TrendJobs from './components/trendjobs/trendjobs';
import Consult from './components/consult/consult';
import About from './components/whyus/whyus';
import Pricing from './components/pricing/pricing';
import Footer from './components/footer/footer';

function App() {


  return (
  <>  
    <Header />
    <Routes>
 
      <Route path='/' element = {
                    <div className="home">
                         <Hero />    
                         <About /> 
                         <Pricing />
                         <Footer />
                    </div>
      }>
      </Route>

      <Route path='choose' element={<UserChoose />}></Route>

     <Route path='/student-interaction' element={
      <StudGeni />
     }>
     </Route>

<Route path='working-professional-interaction' element={
  <WorkerGeni />
}>

</Route>

<Route path='/consult' element={<Consult />}>

</Route>

<Route path='trending-jobs' element={<TrendJobs />}></Route>

    </Routes>
    </>
  )
}

export default App
