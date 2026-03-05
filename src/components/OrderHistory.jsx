import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const OrderHistory = () => {
  const [ordersByDate, setOrdersByDate] = useState({});
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {

        const response = await fetch(
          "http://localhost:3000/api/auth/getuser",
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          }
        );

        const data = await response.json();

        // Adjust if your API nests user differently
        const orderedProducts = data.orderedProducts || [];

        // 1️⃣ Sort by orderDate (newest first)
        orderedProducts.sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        );

        // 2️⃣ Group by date (preserves sorted order)
        const grouped = orderedProducts.reduce((acc, product) => {
          const dateKey = new Date(product.orderDate).toDateString();

          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }

          acc[dateKey].push(product);
          return acc;
        }, {});

        setOrdersByDate(grouped);
      } catch (error) {
        console.error("Failed to fetch order history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-3">Loading order history...</p>
      </div>
    );
  }

  if (Object.keys(ordersByDate).length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h4>No orders found</h4>
        <p className="text-muted">You haven’t placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Your Order History</h2>

      {Object.entries(ordersByDate).map(([date, products]) => (
        <div key={date} className="mb-5">
          <h5 className="mb-3 text-primary">
            📅 {date}
          </h5>

          <div className="row g-4">
            {products.map((product, index) => (
              
              <div className="col-md-6 col-lg-4">
                <Link style={{textDecoration:'none'}} key={index} to={`/product/${product.id}`}>
                <div className="card h-100 shadow-sm">
                  {product.thumbnail && (
                    <img
                      src={product.thumbnail}
                      className="card-img-top"
                      alt={product.title}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}

                  <div className="card-body">
                    <h5 className="card-title">{product.title}</h5>

                    <p className="card-text mb-1">
                      <strong>Price:</strong> ₹{product.price}
                    </p>

                    {product.qty && (
                      <p className="card-text mb-1">
                        <strong>Quantity:</strong> {product.qty}
                      </p>
                    )}

                    <span className="badge bg-success mt-2">
                      ✔ Order Completed
                    </span>
                  </div>
                </div></Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
