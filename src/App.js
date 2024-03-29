import Home from './Components/Home';
import About from './Components/About'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
function App() {
  return (
    <>
      <section className='section'>
      <BrowserRouter>
        <div className="">
        <Routes>
           <Route exact path='/' element={<Home/>}></Route>
           <Route exact path='/about' element={<About/>}></Route>        
        </Routes>
        </div>
        </BrowserRouter>    
    </section>
    </>
  );
}

export default App;
