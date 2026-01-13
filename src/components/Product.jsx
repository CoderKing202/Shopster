import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Categories from "./Categories";

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  

  const handleAddToCart = () => {
    
  };

  const handleBuyNow = () => {
    navigate("/checkOut");
  };

  useEffect(() => {
    (async () => {
      const response = await fetch(`https://dummyjson.com/products/${id}`);
      const result = await response.json();
      setProduct(result);
      setSelectedImage(result.thumbnail || result.images?.[0]);
    })();
  }, [id]);

  if (!product) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <>
      <Categories />

      <div className="container mt-4">
        <div className="row">
          {/* Image Section */}
          <div className="col-md-6">
            <div
              className="border rounded mb-3 d-flex align-items-center justify-content-center"
              style={{
                height: "360px",
                width: "100%",
                overflow: "hidden",
              }}
            >
              <img
                src={selectedImage}
                alt={product.title}
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "contain",
                }}
              />
            </div>

            <div className="d-flex gap-2 justify-content-center flex-wrap">
              {product.images?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt=""
                  className={`border rounded p-1 ${
                    selectedImage === img ? "border-primary" : ""
                  }`}
                  style={{
                    height: "70px",
                    width: "70px",
                    objectFit: "contain",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="col-md-6">
            <h3 className="fw-bold">{product.title}</h3>
            <p className="text-muted text-capitalize">
              {product.brand} · {product.category}
            </p>

            <h4 className="text-success">${product.price}</h4>

            {product.discountPercentage && (
              <span className="badge bg-danger mb-2">
                {product.discountPercentage}% OFF
              </span>
            )}

            <p className="mt-3">{product.description}</p>

            <ul className="list-group list-group-flush mb-3">
              <li className="list-group-item">
                <strong>Rating:</strong> ⭐ {product.rating}
              </li>
              <li className="list-group-item">
                <strong>Stock:</strong> {product.stock}
              </li>
              <li className="list-group-item">
                <strong>SKU:</strong> {product.sku}
              </li>
              <li className="list-group-item">
                <strong>Warranty:</strong> {product.warrantyInformation}
              </li>
              <li className="list-group-item">
                <strong>Shipping:</strong> {product.shippingInformation}
              </li>
              <li className="list-group-item">
                <strong>Return:</strong> {product.returnPolicy}
              </li>
              <li className="list-group-item">
                <strong>Availability:</strong> {product.availabilityStatus}
              </li>
            </ul>
            <ul className="list-group list-group-flush mb-3">
           

              {product.dimensions && (
                <li className="list-group-item">
                  <strong>Dimensions:</strong> {product.dimensions.width} ×{" "}
                  {product.dimensions.height} × {product.dimensions.depth} cm
                </li>
              )}

              <li className="list-group-item">
                <strong>Minimum Order:</strong> {product.minimumOrderQuantity}
              </li>
            </ul>

            <div className="d-flex gap-3 mt-4">
              <button
                className="btn btn-primary btn-lg w-50"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <button
                className="btn btn-success btn-lg w-50"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>
            
          </div>
          {product.reviews && product.reviews.length > 0 && (
  <div className="mt-5">
    <h5>Customer Reviews</h5>
    {product.reviews.map((review, index) => (
      <div key={index} className="border rounded p-3 mb-2">
        <strong>{review.reviewerName}</strong> — ⭐ {review.rating}
        <p className="mb-1">{review.comment}</p>
        <small className="text-muted">{review.date}</small>
      </div>
    ))}
  </div>
)}

        </div>
      </div>
    </>
  );
}

export default Product;
