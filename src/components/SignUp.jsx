import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
import { actionCreators } from "./state";
import { Link } from "react-router-dom";

const countries = [
  { name: "India", code: "+91" },
  { name: "United States", code: "+1" },
  { name: "United Kingdom", code: "+44" },
  { name: "Australia", code: "+61" },
];

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logStatus, addUserCart } = bindActionCreators(
    actionCreators,
    dispatch
  );

  const getCartItems = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await fetch(
      "http://localhost:3000/api/auth/getCartItems",
      {
        method: "GET",
        headers: {
          "auth-token": token,
        },
      }
    );
    const result = await response.json();
    if (result.success) {
      addUserCart(result.cartItems);
    }
  };

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    countryCode: "+91",
    phone: "",
  });

  const [results, setResults] = useState(null);

  const [errors, setErrors] = useState({
    passwordMismatch: false,
    emailsAlreadyExists: false,
    phoneAlreadyExists: false,
    invalidPhone: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset duplicate errors
    setErrors((prev) => ({
      ...prev,
      emailsAlreadyExists: false,
      phoneAlreadyExists: false,
    }));

    // Password validation
    if (credentials.password !== credentials.cpassword) {
      setErrors((prev) => ({ ...prev, passwordMismatch: true }));
      return;
    }

    // Phone validation (digits only, 6–15 length)
    if (!/^\d{6,15}$/.test(credentials.phone)) {
      setErrors((prev) => ({ ...prev, invalidPhone: true }));
      return;
    }

    const { name, email, password, phone, countryCode } = credentials;
    const fullPhoneNumber = `${countryCode}${phone}`;

    const response = await fetch(
      "http://localhost:3000/api/auth/createuser",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phoneNumber: fullPhoneNumber,
        }),
      }
    );

    const data = await response.json();
    setResults(data);

    if (data.success) {
      localStorage.setItem("token", data.authtoken);
      logStatus(true);
      getCartItems();
      navigate("/");
    } else {
      setErrors((prev) => ({
        ...prev,
        emailsAlreadyExists:
          data.error?.toLowerCase().includes("email"),
        phoneAlreadyExists:
          data.error?.toLowerCase().includes("phone"),
      }));
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;

    // Allow only digits in phone field
    if (name === "phone" && !/^\d*$/.test(value)) return;

    setCredentials({ ...credentials, [name]: value });

    if (name === "password" || name === "cpassword") {
      setErrors((prev) => ({ ...prev, passwordMismatch: false }));
    }

    if (name === "email") {
      setErrors((prev) => ({ ...prev, emailsAlreadyExists: false }));
    }

    if (name === "phone") {
      setErrors((prev) => ({
        ...prev,
        invalidPhone: false,
        phoneAlreadyExists: false,
      }));
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
          {/* NAME */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              onChange={onChange}
              placeholder="Enter your full name"
              required
              minLength={5}
            />
          </div>

          {/* EMAIL */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input
              type="email"
              className={`form-control ${
                errors.emailsAlreadyExists ? "is-invalid" : ""
              }`}
              name="email"
              onChange={onChange}
              placeholder="Enter your email"
              required
            />
            {errors.emailsAlreadyExists && (
              <div className="invalid-feedback">
                This email is already registered
              </div>
            )}
            <div className="form-text">We’ll never share your email.</div>
          </div>

          {/* PHONE */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Phone Number</label>
            <div className="d-flex gap-2">
              <select
                className="form-select"
                style={{ maxWidth: "120px" }}
                name="countryCode"
                value={credentials.countryCode}
                onChange={onChange}
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>

              <input
                type="tel"
                className={`form-control ${
                  errors.invalidPhone || errors.phoneAlreadyExists
                    ? "is-invalid"
                    : ""
                }`}
                name="phone"
                value={credentials.phone}
                onChange={onChange}
                placeholder="Phone number"
                required
              />
            </div>

            {errors.invalidPhone && (
              <div className="invalid-feedback d-block">
                Please enter a valid phone number (digits only)
              </div>
            )}

            {errors.phoneAlreadyExists && (
              <div className="invalid-feedback d-block">
                This phone number is already registered
              </div>
            )}
          </div>

          {/* PASSWORD */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className={`form-control ${
                errors.passwordMismatch ? "is-invalid" : ""
              }`}
              name="password"
              onChange={onChange}
              required
              minLength={5}
              placeholder="Create a password"
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Confirm Password</label>
            <input
              type="password"
              className={`form-control ${
                errors.passwordMismatch ? "is-invalid" : ""
              }`}
              name="cpassword"
              onChange={onChange}
              required
              minLength={5}
              placeholder="Re-enter your password"
            />
            {errors.passwordMismatch && (
              <div className="invalid-feedback d-block">
                Passwords do not match
              </div>
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
            Already have an account? <Link to="/login">Login</Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
