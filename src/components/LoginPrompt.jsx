import React from "react";
import { Link } from "react-router-dom";

function LoginPrompt() {
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #e0f2fe, #f8fafc)"
      }}
    >
      <div
        className="card shadow-lg p-5 text-center"
        style={{
          maxWidth: "90%",
          width: "100%",
          height: "70%",
          borderRadius: "16px",
          background: "linear-gradient(145deg, #ffffff, #f1f5f9)"
        }}
      >
        <h2
          className="mb-3 fw-bold"
          style={{ color: "#1e3a8a", letterSpacing: "0.5px" }}
        >
          Welcome Back! 😊
        </h2>

        <p
          className="fs-5 mb-4"
          style={{ color: "#475569", lineHeight: "1.6" }}
        >
          It looks like you're not logged in yet.
          <br />
          Please login to continue and enjoy a personalized shopping experience.
        </p>

        <Link
          to="/login"
          className="btn btn-lg px-5"
          style={{
            background: "linear-gradient(to right, #2563eb, #1d4ed8)",
            border: "none",
            color: "#fff",
            
            boxShadow: "0 4px 10px rgba(37, 99, 235, 0.4)",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default LoginPrompt;
