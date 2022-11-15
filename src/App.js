import "./App.css";
import Home from "./components/Home";
import Navbar from "./components/Navbar"
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import About from "./components/About";
import NoteState from "./context/NoteState";
import Alerts from "./components/Alerts";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  return (
    <>
    <NoteState>
    <Router>
      <Navbar />
      <Alerts message= "Amazing"/>
      <div className="container my-5">
    <Routes>
      <Route exact path= "/" element={<Home/>}/>
      <Route exact path = "/about" element={<About/>}/>
      <Route exact path = "/login" element={<Login/>}/>
      <Route exact path = "/signup" element={<Signup/>}/>
      {/* <Route path = "/about" element={<About/>}/> */}
      </Routes></div> 
      </Router>
      </NoteState>
    </>
  );
}

export default App;
