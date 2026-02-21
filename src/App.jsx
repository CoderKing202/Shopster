import { useEffect, useState } from "react";
import "./App.css";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import Category from "./components/Category";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
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
import Congratulation from "./components/Congractulation";
import OrderHistory from "./components/OrderHistory";
import OTPVerification from "./components/OTPVerification";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  const dispatcher = useDispatch();
  const { logStatus, addUserCart } = bindActionCreators(
    actionCreators,
    dispatcher,
  );
  const [count, setCount] = useState(0);
  const [category, setCategory] = useState("Smartphones");
  const token = localStorage.getItem("token");
  const getCartItems = async () => {
    const response = await fetch(
      "http://localhost:3000/api/auth/getCartItems",
      {
        method: "GET",
        headers: {
          "auth-token": token,
        },
      },
    );
    const result = await response.json();
    if (result.success) {
      addUserCart(result.cartItems);
      console.log(result.cartItems);
    }
  };
  const addToCart = async (product) => {
    console.log(token);

    const response = await fetch("http://localhost:3000/api/auth/addCartItem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify(product),
    });
  };
  const removeCartItem = async (product) => {
    const response = await fetch(
      "http://localhost:3000/api/auth/removeCartItem",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(product),
      },
    );
  };
  useEffect(() => {
    if (token) {
      logStatus(true);
      getCartItems();
    }
  });
  return (
    <>
      <Router>
        <NavBar />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/category/:categoryName"
              element={
                <Category
                  category={category}
                  addToCart={addToCart}
                  removeCartItem={removeCartItem}
                />
              }
            />
            <Route path="/loginplease" element={<LoginPrompt />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product/:id" element={<Product />} />
            <Route
              path="/search/:query"
              element={
                <SearchResults
                  addToCart={addToCart}
                  removeCartItem={removeCartItem}
                />
              }
            />
            <Route
              path="/cart"
              element={<Cart removeCartItem={removeCartItem} />}
            />
            <Route
              path="/checkOut"
              element={<Checkout removeCartItem={removeCartItem} />}
            />
            <Route path="/userProfile" element={<UserProfile />} />
            <Route path="/congractulation" element={<Congratulation />} />
            <Route path="/orderHistory" element={<OrderHistory />} />
            <Route path="/otpVerification" element={<OTPVerification />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
          </Routes>
        </div>
      </Router>
      <br />
    </>
  );
}

export default App;
