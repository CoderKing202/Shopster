import { useState } from "react";
import "./App.css";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import Category from "./components/Category";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Categories from "./components/Categories";
import LoginPrompt from "./components/LoginPrompt";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Product from "./components/Product";
import SearchResults from "./components/SearchQuery";


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
            <Route path='/loginplease' element={<LoginPrompt/>}/> 
            <Route path='/signUp' element={<SignUp/>}/> 
            <Route path='/login' element={<Login/>}/> 
            <Route path='/product/:id' element={<Product/>}/> 
            <Route path="/search/:query" element={<SearchResults/>} />
        </Routes>
      </div>
    </Router>
    <br />
    </>
  );
}

export default App;
