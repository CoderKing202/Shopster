import { useState } from "react";
import "./App.css";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    <Router>
      <NavBar />
      <div>
        <Routes>
            <Route path='/' element={<Home/>}/> 
        </Routes>
      </div>
    </Router>
    </>
  );
}

export default App;
