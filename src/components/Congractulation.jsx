import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";

const Congratulation = () => {
  const hasSentRef = useRef(false);
  const [countdown, setCountdown] = useState(5);
  const token = useSelector((state) => state.token);
  const orderedProducts = JSON.parse(localStorage.getItem("buyProducts")).map(
    product => ({
      ...product,
      orderDate: new Date(),
    }),
  );

  const updateOrderHistory = async () => {
    
    const response = await fetch(
      "http://localhost:3000/api/auth/addorderedproducts",
      {
        method: "POST",
        body: JSON.stringify({ orderedProducts }),
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      },
    );
    localStorage.setItem("buyProducts",JSON.stringify([]))
  };
  useEffect(() => {
      if (hasSentRef.current) return;
  hasSentRef.current = true;
    if (!token) {
      navigate("/loginplease");
    } else {
      
      updateOrderHistory();
      
      
    }
  }, []);
  useEffect(() => {
    if (countdown === 0) {
      window.location.href = "/";
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div
        className="card shadow-lg p-5 text-center"
        style={{ maxWidth: "420px" }}
      >
        <div className="mb-4">
          <span className="display-4 text-success">✔</span>
        </div>

        <h2 className="mb-3 text-success">Order Placed Successfully!</h2>

        <p className="text-muted mb-4">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        <div className="alert alert-info mb-0">
          Redirecting to Home in <strong>{countdown}</strong> seconds...
        </div>
      </div>
    </div>
  );
};

export default Congratulation;
