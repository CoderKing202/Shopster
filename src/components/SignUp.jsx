import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function SignUp(props) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, cpassword } = credentials;
    const response = await fetch("http://localhost:3000/api/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const json = await response.json();
    console.log(json);
    if (json.success) {
      localStorage.setItem("token", json.authtoken);
      navigate("/");
      props.showAlert("Account Created Successfully", "success");
    } else {
      props.showAlert("Invalid details", "danger");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: "420px", width: "100%", borderRadius: "12px" }}>
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
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              onChange={onChange}
              name="email"
              placeholder="Enter your email"
            />
            <div className="form-text">We’ll never share your email.</div>
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">
              Password
            </label>
            <input
              type="password"
              className="form-control"
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
              className="form-control"
              id="cpassword"
              onChange={onChange}
              name="cpassword"
              required
              minLength={5}
              placeholder="Re-enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
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
