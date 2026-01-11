import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login(props) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const json = await response.json();
    console.log(json);
    if (json.success) {
      localStorage.setItem("token", json.authtoken);
      navigate("/");
    } else {
      
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
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
          <h3 className="fw-bold">Welcome Back</h3>
          <p className="text-muted">Login to continue shopping</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              required
              value={credentials.email}
              onChange={onChange}
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
              id="exampleInputPassword1"
              required
              name="password"
              value={credentials.password}
              onChange={onChange}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Don’t have an account? <a href="/signup">Create one</a>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;
