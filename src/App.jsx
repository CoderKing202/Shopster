import { useState } from "react";
import "./App.css";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import Category from "./components/Category";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Categories from "./components/Categories";


function App() {
  const [count, setCount] = useState(0);
  const [category,setCategory]=useState("Smartphones")  
  return (
    <>
    <Router>
      <NavBar />
      <div>
        <Routes>
            <Route path='/' element={<Home />}/> 
            <Route path='/category/:categoryName' element={<Category category={category} />}/> 
        </Routes>
      </div>
    </Router>
    </>
  );
}

export default App;
