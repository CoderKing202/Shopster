import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Categories from "./Categories";

function SearchResults() {
  const { query } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState("");

  const handleAddToCart = () =>{};
   const handleBuyNow = (product) => {
    product.quantity=1
    localStorage.setItem("buyProducts",JSON.stringify([product]))
    navigate("/checkOut");
  
  };

  useEffect(() => {
    setProducts([]);
    setLoading(true);

    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        const q = query.toLowerCase();
        const matched = data.products.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
        setProducts(matched);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query]);

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
    <Categories/>
    <div className="container-fluid mt-4">
      <div className="row">

        {/* Left Column */}
        <div className="col-md-4">
          <h3 className="mb-3">
            Search results for: <span className="text-primary">"{query}"</span>
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
          ) : sortedProducts.length === 0 ? (
            <div className="d-flex flex-column align-items-center justify-content-center text-center p-5 bg-light rounded">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076503.png"
                alt="No results"
                width="120"
                className="mb-3"
              />
              <h4>No products found</h4>
              <p className="text-muted">
                We couldn’t find anything matching "<strong>{query}</strong>".
              </p>
              <Link to="/" className="btn btn-outline-primary mt-2">
                Back to Home
              </Link>
            </div>
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
                              handleBuyNow(product);
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

export default SearchResults;
