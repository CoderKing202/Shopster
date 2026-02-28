import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [backendError, setBackendError] = useState("");
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };
  const token = localStorage.getItem("resetToken");
  const handleSubmit = async (e) => {
    e.preventDefault();
     if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    console.log(token)
    const response = await fetch(
      "http://localhost:3000/api/auth/resetPassword",
      {
        method: "POST",
        body: JSON.stringify({
          newPassword: form.password,
        }),
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      },
    );

    const result = await response.json();
    if (result.success) {
      navigate("/login");
      localStorage.removeItem("resetToken");
    } else {
      setBackendError(result.error);
    }
   

    console.log("New Password:", form.password);
    // call API to reset password
  };

  return (
    <>
      {token && (
        <div
          className="container d-flex justify-content-center align-items-center"
          style={{ minHeight: "90vh" }}
        >
          <div
            className="card shadow-lg p-4"
            style={{ maxWidth: "400px", width: "100%", borderRadius: "12px" }}
          >
            <h4 className="fw-bold text-center mb-3">Reset Password</h4>
            <p className="text-muted text-center mb-4">
              Enter your new password
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">New Password</label>
                <input
                  type="password"
                  className={`form-control ${error !== "" || backendError !== "" || "" ? "is-invalid" : ""}`}
                  name="password"
                  placeholder="Enter new password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={5}
                />
                {backendError && (
                  <div className="invalid-feedback">{backendError}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className={`form-control ${error ? "is-invalid" : ""}`}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={5}
                />
                {error && <div className="invalid-feedback">{error}</div>}
              </div>

              <button
                type="submit"
                className="btn btn-success w-100 py-2 fw-semibold"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ResetPassword;
