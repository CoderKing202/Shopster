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
  const [error, setError] = useState("");
  const [otherErrors, setOtherErrors] = useState("");
  const [showresendButton, setResendButton] = useState(true);
  const isReloadingRef = useRef(false);
  const [resend, setResend] = useState(true);
  const success = useRef(false)

  const [generateCounter, setGenerateCounter] = useState(5);

  const dispatch = useDispatch();
  const { logStatus, addUserCart } = bindActionCreators(
    actionCreators,
    dispatch,
  );
  const [redirectTime, setRedirectTime] = useState(5);

  let creds;
  const resendOTP = async () => {
    const otpResponse = await fetch(
      "http://localhost:3000/api/auth/generate-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: otpCredentials.userId,
          identifier: otpCredentials.identifier,
          channel: "email",
          purpose: otpCredentials.purpose,
        }),
      },
    );
    const otpResult = await otpResponse.json();
    if (otpResult.success) {
      setGenerateCounter(generateCounter - 1);
    }
    if (!otpResult.success) {
      if (otpResult.error === "OTPgenlimitExceed") {
        setOtherErrors("You have reached maximum OTP generation limit");
      }
      setResendButton(false);
      setError("");
      setTimeout(() => {
        navigate(`/${getRedirectPage()}`);
      }, 5000);
    }

    setResend(!resend);
  };
  const getRedirectPage = () => {
    if (!otpCredentials) return "login";

    if (
      otpCredentials.purpose === "login" ||
      otpCredentials.purpose === "forgotPassword"
    ) {
      return "login";
    } else if (otpCredentials.purpose === "register") {
      return "signup";
    }
  };
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
  // All useEffects
  useEffect(() => {
    if (!otherErrors) return;

    setRedirectTime(5);

    const interval = setInterval(() => {
      setRedirectTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [otherErrors]);

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
      if(!success.current){
      const resetResponse = await fetch(
        "http://localhost:3000/api/auth/resetUserAttempt",
        {
          method: "POST",
          body: JSON.stringify({ userId: creds.userId }),
          headers: { "Content-Type": "application/json" },
        },
      );
    }
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
  useEffect(() => {
    (async () => {
      const response = await fetch(
        "http://localhost:3000/api/auth/getOtpTimer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: otpCredentials.userId }),
        },
      );
      const data = await response.json();
      if (data.success) {
        setTimeLeft(data.remainingTime);
      }
    })();
  }, [resend]);
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
        purpose: otpCredentials.purpose,
      }),
    });
    const result = await response.json();
    console.log(result);
    if (result.success) {
      success.current = true
      if (
        otpCredentials.purpose === "register" ||
        otpCredentials.purpose === "login"
      ) {
        localStorage.setItem("token", result.token);
        logStatus(true);
        navigate("/");
      } else if (otpCredentials.purpose === "forgotPassword") {
        localStorage.setItem("resetToken", result.token);
        navigate("/resetPassword");
      }

      getCartItems();
    } else {
      if (result.error === "wrongOtp") {
        console.log(result.attempts);

        setError(
          `Incorrect OTP. Only ${5 - result.attempts} attempts remaining`,
        );
      } else if (result.error === "noMoreAttempts") {
        if (result.error === "noMoreAttempts") {
          setOtherErrors("You have reached maximum 5 attempts");
        }

        setResendButton(false);
        setError("");
        setTimeout(() => {
          navigate(`/${getRedirectPage()}`);
        }, 5000);
      }
    }
  };
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    setError("");
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
    <>
      {otherErrors === "" ? (
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
              Enter the 6-digit code sent to your email <br />
              Only <strong>5</strong> attempts available for verification
              <br />
              You can request a new OTP <strong>{generateCounter}</strong> more
              time(s).
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
                    className={`form-control otp-input ${error ? "error" : ""}`}
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
                    required
                  />
                ))}
                <br />
              </div>
              {error && (
                <div
                  className="text-danger text-center mt-2"
                  style={{ fontSize: "14px" }}
                >
                  {error}
                </div>
              )}

              {/* TIMER OR RESEND */}
              {timeLeft > 0 ? (
                <div className="text-muted mb-3">
                  Expires in: <strong>{formatTime(timeLeft)}</strong>
                </div>
              ) : showresendButton ? (
                <button
                  type="button"
                  className="my-2 btn btn-primary w-100 py-2 fw-semibold"
                  onClick={resendOTP}
                >
                  Resend OTP
                </button>
              ) : (
                <></>
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
      ) : (
        <div
          className="container d-flex justify-content-center align-items-center"
          style={{ minHeight: "90vh" }}
        >
          <div
            className="card shadow-lg p-4 text-center"
            style={{ maxWidth: "400px", width: "100%", borderRadius: "12px" }}
          >
            <h4 className="fw-bold text-danger mb-3">⚠️ Verification Failed</h4>

            <p className="mb-3" style={{ fontSize: "15px" }}>
              {otherErrors}
            </p>

            <div className="text-muted mb-2">
              Redirecting to <strong>{getRedirectPage()}</strong> in:
            </div>

            <h3 className="fw-bold text-primary">{redirectTime}s</h3>

            <div className="mt-3">
              <button
                className="btn btn-outline-primary w-100"
                onClick={() => navigate(`/${getRedirectPage()}`)}
              >
                Go Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OTPVerification;
