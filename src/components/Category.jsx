import React, { useEffect, useState } from "react";
import Categories from "./Categories";
import { useParams, useNavigate, Link } from "react-router-dom";

function Category({ category, setCategory }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categoryName } = useParams();
  const [sortType, setSortType] = useState("");
  const navigate = useNavigate();

  const handleAddToCart = () => {
    navigate("/loginplease");
  };

  const handleBuyNow = () => {
    navigate("/loginplease");
  };

  useEffect(() => {
    setProducts([]);
    setLoading(true);
    fetch(
      `https://dummyjson.com/products/category/${encodeURIComponent(
        categoryName
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categoryName]);

  const sortedProducts = [...products];
  if (sortType === "price-asc") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortType === "price-desc") {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortType === "discount-desc") {
    sortedProducts.sort(
      (a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0)
    );
  }

  return (
    <>
      <Categories setLoading={setLoading} />
      <div className="container-fluid mt-4">
        <div className="row">
          {/* Left Column */}
          <div className="col-md-4">
            <h3 className="mb-3 text-capitalize">
              {categoryName.replace("-", " ")}
            </h3>

            <div className="mb-3">
              <h6>Sort Products</h6>
              <select
                className="form-select"
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
              >
                <option value="">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount-desc">Discount: High to Low</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-md-8">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="row g-3">
                {sortedProducts.map((product) => (
                  <div className="col-sm-6 col-lg-4" key={product.id}>
                    <Link
                      to={`/product/${product.id}`}
                      className="text-decoration-none text-dark"
                    >
                      <div className="card h-100 position-relative">
                        {product.discountPercentage && (
                          <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                            {product.discountPercentage}% OFF
                          </span>
                        )}

                        <img
                          src={product.thumbnail || product.images?.[0]}
                          className="card-img-top"
                          alt={product.title}
                          style={{ height: "160px", objectFit: "contain" }}
                        />

                        <div className="card-body d-flex flex-column">
                          <h6 className="card-title">{product.title}</h6>
                          <p className="card-text fw-bold mb-2">
                            ${product.price}
                          </p>

                          <div className="d-flex justify-content-between mt-auto">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddToCart();
                              }}
                            >
                              Add to Cart
                            </button>
                            <button
                              className="btn btn-sm btn-success"
                              onClick={(e) => {
                                e.preventDefault();
                                handleBuyNow();
                              }}
                            >
                              Buy Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
    </>
  );
}

export default Category;
