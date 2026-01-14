import { useEffect, useState } from "react";
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
import AddToCart from "./components/Cart";
import Checkout from "./components/Checkout";
import UserProfile from "./components/UserProfile";
import Cart from "./components/Cart";
import { useDispatch } from "react-redux";
import { actionCreators } from "./components/state";
import { bindActionCreators } from "redux";

function App() {
  const loginDispatch = useDispatch()
  const {logStatus} = bindActionCreators(actionCreators, loginDispatch)
  const [count, setCount] = useState(0);
  const [category,setCategory]=useState("Smartphones")  
  const token = localStorage.getItem("token")
  
  useEffect(()=>{
    if(token){
      logStatus(true)
    }
  })
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
            <Route path="/cart" element={<Cart/>} />
            <Route path="/checkOut" element={<Checkout/>} />
            <Route path="/userProfile" element={<UserProfile/>} />
        </Routes>
      </div>
    </Router>
    <br />
    </>
  );
}

export default App;
