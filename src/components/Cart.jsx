import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeItem } from "./state/action-creators";
import { useDispatch } from "react-redux";
import { actionCreators } from "./state";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";

function Cart({ removeCartItem }) {
  const navigate = useNavigate();
  
  const cartItems = useSelector((state) => state.cartItems);
  const dispatcher = useDispatch();
  const token = localStorage.getItem("token");
  const { removeItem, incrementProductQuantity, decrementProductQuantity } =
    bindActionCreators(actionCreators, dispatcher);
  const incrementQuantity = async (product) => {
      console.log(product.id)
    const response = await fetch(
      "http://localhost:3000/api/auth/incrementQuantity",
      {
        method: "POST",
        body: JSON.stringify({ id : product.id}),
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      },
    );
    const result = await response.json();
    if (result.success) {
      incrementProductQuantity(product);
    }
  };
  const decrementQuantity = async (product) => {
  
    const response = await fetch(
      "http://localhost:3000/api/auth/decrementQuantity",
      {
        method: "POST",
        body: JSON.stringify({ id:product.id }),
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      },
    );
    const result = await response.json()
    if(result.success)
    {
      decrementProductQuantity(product);
    }
  };
  const quantityIncrease = (e, product) => {
    e.stopPropagation();
    incrementQuantity(product);
    console.log(cartItems);
  };

  const quantityDecrease = (e, product) => {
    e.stopPropagation();
    if (product.quantity > 1) {
      decrementQuantity(product)
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/loginplease");
    }
  }, [navigate]);

  const handleBuyNow = (id) => {
    navigate(`/checkOut`);
  };

  const handleRemove = (item) => {
    // Hook this to redux + backend later
    removeCartItem(item);
    removeItem(item);
  };

  return (
    <div className="container-fluid d-flex justify-content-center mt-4">
      <div style={{ width: "90%" }}>
        <h3 className="mb-4">Your Cart</h3>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cartItems
              .sort((a, b) => a.price - b.price)
              .map((item) => (
                <div
                  key={item.id}
                  className="card mb-3 shadow-sm"
                  style={{ width: "100%", cursor: "pointer" }}
                  onClick={() => {
                    navigate(`/product/${item.id}`);
                  }}
                >
                  <div className="row g-0 align-items-center">
                    {/* LEFT COLUMN - IMAGE */}
                    <div className="col-md-3 text-center p-3">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="img-fluid rounded"
                        style={{ maxHeight: "150px" }}
                      />
                    </div>

                    {/* RIGHT COLUMN - DETAILS */}
                    <div className="col-md-9">
                      <div className="card-body">
                        <h5 className="card-title">{item.title}</h5>
                        <p className="card-text text-muted">
                          Price: ₹{item.price}
                        </p>

                        {/* QUANTITY COUNTER */}
                        <div className="d-flex align-items-center gap-3 mt-3">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={(e) => {
                              quantityDecrease(e, item);
                            }}
                          >
                            −
                          </button>
                          <span className="fw-bold">{item.quantity}</span>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={(e) => {
                              quantityIncrease(e, item);
                            }}
                          >
                            +
                          </button>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="d-flex gap-3 mt-4">
                          <button
                            className="btn btn-danger"
                            onClick={(e) => {
                              (e.stopPropagation(), handleRemove(item));
                            }}
                          >
                            Remove
                          </button>

                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              (e.stopPropagation(), handleBuyNow(item.id));
                            }}
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {/* CHECKOUT BUTTON */}
            <div className="d-flex justify-content-end mt-4">
              <button
                className="btn btn-primary btn-lg px-5"
                onClick={() => navigate("/checkout")}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
