import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();

  const buyProducts = JSON.parse(localStorage.getItem("buyProducts")) || [];

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
            <button className="btn btn-primary btn-lg fw-bold">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
