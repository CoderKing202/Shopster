import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
import { actionCreators } from "./state";

function OTPVerification({ onSubmit }) {
  const navigate = useNavigate();
  const [otpCredentials, setOtpCredentials] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const isReloadingRef = useRef(false);
    const dispatch = useDispatch();
  const { logStatus, addUserCart } = bindActionCreators(
    actionCreators,
    dispatch,
  );
  let creds;

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
      },
    );
    const result = await response.json();
    if (result.success) {
      addUserCart(result.cartItems);
    }
  };
  useEffect(() => {
    const markReload = () => {
      isReloadingRef.current = true;
    };

    window.addEventListener("beforeunload", markReload);
    return () => window.removeEventListener("beforeunload", markReload);
  }, []);

  useEffect(() => {
    (async () => {
      creds = JSON.parse(localStorage.getItem("purposeData"));
      console.log(creds);
      if (!creds) {
        const path = JSON.parse(localStorage.getItem("purpose"));
        if (path.purpose === "register") {
          navigate("/signup");
        } else if (path.purpose === "login") {
          navigate("/login");
        }

        return;
      }
      setOtpCredentials(creds);

      // fetch timer
      const response = await fetch(
        "http://localhost:3000/api/auth/getOtpTimer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: creds.userId }),
        },
      );
      const data = await response.json();
      if (data.success) {
        setTimeLeft(data.remainingTime);
      }
    })();
    // componentDidUnmount
    return async () => {
      if (isReloadingRef.current) return;

      // const creds = JSON.parse(localStorage.getItem("purposeData"))
      // console.log(creds.userId)
      const response = await fetch("http://localhost:3000/api/auth/deleteOTP", {
        method: "POST",
        body: JSON.stringify({ userId: creds.userId }),
        headers: { "Content-Type": "application/json" },
      });
      localStorage.removeItem("purposeData");
    };
  }, [navigate]);

  // countdown effect
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // format time hh:mm:ss
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // verify otp
  const verifyOtp = async () => {
    if (!otpCredentials) return;
    console.log(otpCredentials);
    const finalOtp = otp.join("");
    console.log(finalOtp);
    
    const response = await fetch("http://localhost:3000/api/auth/verifyOtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: otpCredentials.userId,
        otp: finalOtp,
        purpose:otpCredentials.purpose
      }),
    });
    const result = await response.json();
    console.log(result);
    if (result.success) {
      localStorage.setItem("token", result.token);
      logStatus(true)
      navigate("/");
      getCartItems()
    }
  };

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = pasteData.split("");
    while (newOtp.length < 6) newOtp.push("");
    setOtp(newOtp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyOtp();
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <div
        className="card shadow-lg p-4 text-center"
        style={{ maxWidth: "400px", width: "100%", borderRadius: "12px" }}
      >
        <h4 className="fw-bold mb-2">Verify OTP</h4>
        <p className="text-muted mb-4">
          Enter the 6-digit code sent to your email
        </p>

        <form onSubmit={handleSubmit}>
          <div
            className="d-flex justify-content-center gap-2 mb-3"
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                className="form-control text-center fw-bold"
                style={{
                  width: "45px",
                  height: "55px",
                  fontSize: "1.4rem",
                  borderRadius: "8px",
                }}
                maxLength="1"
                value={digit}
                ref={(el) => (inputsRef.current[index] = el)}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          {/* TIMER OR RESEND */}
          {timeLeft > 0 ? (
            <div className="text-muted mb-3">
              Expires in: <strong>{formatTime(timeLeft)}</strong>
            </div>
          ) : (
            <button
              type="button"
              className="my-2 btn btn-primary w-100 py-2 fw-semibold"
              onClick={() => window.location.reload()}
            >
              Resend OTP
            </button>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-semibold"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}

export default OTPVerification;
