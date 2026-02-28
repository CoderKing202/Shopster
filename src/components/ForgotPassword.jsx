import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate()
  const [error,setError] = useState("")
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:3000/api/auth/getUserIdbyEmail?email=${email}`,{
    })
    const data = await response.json()
    console.log(data)
    if(data.success){
      const otpResponse = await fetch(
        "http://localhost:3000/api/auth/generate-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: data.userId,
            identifier: email,
            channel: "email",
            purpose: "forgotPassword",
          }),
        },
      );
      localStorage.setItem(
        "purposeData",
        JSON.stringify({
          userId: data.userId,
          purpose: "forgotPassword",
          identifier: email,
          channel: "email",
        }),
      );
      localStorage.setItem("purpose",JSON.stringify({
        purpose:"forgotPassword"
      }));
      navigate("/otpVerification");
    }
    else{
      setError(data.error)
    }
    // call API to send OTP
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "400px", width: "100%", borderRadius: "12px" }}
      >
        <h4 className="fw-bold text-center mb-3">Forgot Password</h4>
        <p className="text-muted text-center mb-4">
          Enter your email to receive OTP
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input
              type="email"
              className={`form-control ${error ? "is-invalid" : ""}`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>{ setEmail(e.target.value),setError("")}}
              required
            />
            {error && <div className="invalid-feedback">{error}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-semibold"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;