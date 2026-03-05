import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { actionCreators } from "./state";
import { bindActionCreators } from "redux";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

function Checkout({ removeCartItem }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addUserCart, removeItem } = bindActionCreators(
    actionCreators,
    dispatch,
  );
  const token = useSelector((state) => state.token);
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  const buyProducts = JSON.parse(localStorage.getItem("buyProducts")) || [];
  const api_key = import.meta.env.VITE_RAZORPAY_KEY_ID;

  const totalCheckOutAmount = () => {
    let amount = 0;
    console.log(buyProducts);
    buyProducts.forEach((product) => {
      amount += product.price * product.quantity;
    });
    // let totalAmount = await DollarToRupeeConverter(amount);
    let totalAmount = amount;
    console.log(totalAmount);
    return totalAmount;
  };

  const DollarToRupeeConverter = async (amount) => {
    const response = await fetch(
      "https://api.exchangerate-api.com/v4/latest/USD",
    );
    const result = await response.json();
    const realAmount = amount * result.rates.INR;
    return realAmount;
  };

  const handlePayment = async () => {
    const isLoaded = await loadRazorpay();

    if (!isLoaded) {
      alert("Razorpay SDK failed to load");
      return;
    }

    // 1. Create order
    const res = await fetch("http://localhost:3000/api/orders/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: /*await*/ totalCheckOutAmount() }), // ₹500
    });

    const data = await res.json();

    // 2. Open Razorpay
    const options = {
      key: api_key, // your test key
      amount: data.order.amount,
      currency: "INR",
      order_id: data.order.id,

      handler: async function (response) {
        // 3. Verify payment
        const verifyRes = await fetch(
          "http://localhost:3000/api/orders/verify-payment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          },
        );

        const result = await verifyRes.json();

        if (result.success) {
          if (buyProducts.length > 1) {
            addUserCart([]);
            resetCartItems();
          } else if (buyProducts.length === 1) {
            removeCartItem(buyProducts[0]);
            removeItem(buyProducts[0]);
          }
          navigate("/congractulation");
          alert("Payment Successful ✅");
        } else {
          alert("Payment verification failed ❌");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const resetCartItems = async () => {
    try {

      const response = await fetch(
        "http://localhost:3000/api/auth/resetCartItems",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        console.log("Cart reset successfully");
      }
    } catch (error) {
      console.error("Failed to reset cart items", error);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/loginplease");
    }
  }, [navigate]);

  const totalPayable = useMemo(() => {
    return buyProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }, [buyProducts]);

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4 fw-bold">Checkout</h1>

      {/* Products List */}
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {buyProducts.map((item) => (
            <div key={item.id} className="card mb-4 shadow-sm">
              <div className="card-body">
                <div className="row align-items-center">
                  {/* Left Column - Image */}
                  <div className="col-md-3 text-center mb-3 mb-md-0">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="img-fluid rounded"
                      style={{ maxHeight: "140px", objectFit: "cover" }}
                    />
                  </div>

                  {/* Right Column - Details */}
                  <div className="col-md-9">
                    <h5 className="fw-semibold">{item.title}</h5>

                    <p className="fs-4 mt-3 mb-0">
                      ${item.price} × {item.quantity} =
                      <span className="fw-bold text-success ms-2">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Total Summary */}
          <div className="card shadow-sm mt-4">
            <div className="card-body text-end">
              <h4 className="mb-1">Total Payable</h4>
              <h2 className="fw-bold text-success">
                ${totalPayable.toFixed(2)}
              </h2>
            </div>
          </div>

          {/* Buy Button */}
          <div className="d-grid mt-4">
            <button
              className="btn btn-primary btn-lg fw-bold"
              onClick={() => {
                handlePayment();
              }}
            >
              Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
