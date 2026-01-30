import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { actionCreators } from "./state";
import { bindActionCreators } from "redux";
import { useDispatch } from "react-redux";


function Checkout({removeCartItem}) {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const {addUserCart,removeItem} = bindActionCreators(actionCreators,dispatch)
  const buyProducts = JSON.parse(localStorage.getItem("buyProducts")) || [];
  const resetCartItems = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:3000/api/auth/resetCartItems",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      }
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
    if (!localStorage.getItem("token")) {
      navigate("/loginplease");
    }
  }, [navigate]);

  const totalPayable = useMemo(() => {
    return buyProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
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
            <button className="btn btn-primary btn-lg fw-bold"
            onClick={()=>{navigate("/congractulation")
            if(buyProducts.length>1)  
            {
              addUserCart([])
              resetCartItems()
              
            }
            else if(buyProducts.length === 1){
              removeCartItem(buyProducts[0])
              removeItem(buyProducts[0])
            }
            }}>
              Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
