import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
import { actionCreators } from "./state"

function SignUp(props) {
  const navigate = useNavigate();
  const dispatcher = useDispatch()
  const {logStatus,addUserCart} = bindActionCreators(actionCreators,dispatcher)
    const getCartItems = async () => {
    const response = await fetch("http://localhost:3000/api/auth/getCartItems", {
      method:"GET",
      headers:{
        "auth-token":token
      }
    });
    const result = await response.json()
    if(result.success){
      addUserCart(result.cartItems)
      console.log(result.cartItems)
    }    
    
  };
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const [results,setResults] = useState(null)
  const [errors, setErrors] = useState({
    passwordMismatch: false,
    emailsAlreadyExists: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (credentials.password !== credentials.cpassword) {
      setErrors((prev)=> ({...prev,passwordMismatch: true}) );
      return; // Stop submission
    } else {
      setErrors((prev)=> ({...prev,passwordMismatch: false}) );
    }

    const { name, email, password } = credentials;
    const response = await fetch("http://localhost:3000/api/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const results = await response.json();
    setResults(results)
    if (results.success) {
      localStorage.setItem("token", results.authtoken);
      logStatus(true)
      getCartItems()
      navigate("/");
    } else {
      setErrors((prev)=>({
        ...prev,
        emailsAlreadyExists:true
      }))
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

    // Reset password mismatch error on typing
    if (e.target.name === "password" || e.target.name === "cpassword") {
      setErrors((prev)=>({...prev, passwordMismatch: false }));
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "420px", width: "100%", borderRadius: "12px" }}
      >
        <div className="text-center mb-3">
          <h3 className="fw-bold">Create Account</h3>
          <p className="text-muted">Join us and start shopping smarter</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label fw-semibold">
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              onChange={onChange}
              name="name"
              placeholder="Enter your full name"
              required
              minLength={5}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">
              Email Address
            </label>
            <input
              type="email"
              className={`form-control ${errors.emailsAlreadyExists?"is-invalid":""}`}
              id="email"
              onChange={onChange}
              name="email"
              placeholder="Enter your email"
              required
            />
              {errors.emailsAlreadyExists && (
              <div className="invalid-feedback">{results.error}</div>
            )}
            <div className="form-text">We’ll never share your email.</div>
          </div>
       
          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">
              Password
            </label>
            <input
              type="password"
              className={`form-control ${
                errors.passwordMismatch ? "is-invalid" : ""
              }`}
              id="password"
              onChange={onChange}
              name="password"
              required
              minLength={5}
              placeholder="Create a password"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="cpassword" className="form-label fw-semibold">
              Confirm Password
            </label>
            <input
              type="password"
              className={`form-control ${
                errors.passwordMismatch ? "is-invalid" : ""
              }`}
              id="cpassword"
              onChange={onChange}
              name="cpassword"
              required
              minLength={5}
              placeholder="Re-enter your password"
            />
            {errors.passwordMismatch && (
              <div className="invalid-feedback">Passwords do not match</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-semibold"
          >
            Create Account
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Already have an account? <a href="/login">Login</a>
          </small>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
