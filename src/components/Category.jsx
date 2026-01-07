import React, { useEffect, useState } from "react";
import Categories from "./Categories";
import { useParams } from "react-router-dom";

function Category({ category, setCategory }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categoryName } = useParams();
  const [sortType, setSortType] = useState(""); // new state for sorting

  console.log(categoryName);

  useEffect(() => {
    setProducts([]);
    setLoading(true);
    fetch(`https://dummyjson.com/products/category/${encodeURIComponent(categoryName)}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categoryName]);

  // Sorting logic
  const sortedProducts = [...products]; // create a copy to avoid mutating state
  if (sortType === "price-asc") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortType === "price-desc") {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortType === "discount-desc") {
    sortedProducts.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
  }

  return (
    <>
      <Categories setLoading={setLoading} />
      <div className="container-fluid mt-4">
        <div className="row">
          {/* Left Column - 1/3 */}
          <div className="col-md-4">
            <h3 className="mb-3 text-capitalize">{categoryName.replace("-", " ")}</h3>

            {/* Sorting UI */}
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

          {/* Right Column - 2/3 */}
          <div className="col-md-8">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="row g-3">
                {sortedProducts.map((product) => (
                  <div className="col-sm-6 col-lg-4" key={product.id}>
                    <div className="card h-100">
                      <img
                        src={product.thumbnail || product.images?.[0]}
                        className="card-img-top"
                        alt={product.title}
                        style={{ height: "160px", objectFit: "contain" }}
                      />
                      <div className="card-body">
                        <h6 className="card-title">{product.title}</h6>
                        <p className="card-text">${product.price}</p>
                        {product.discountPercentage && (
                          <small className="text-success">
                            {product.discountPercentage}% off
                          </small>
                        )}
                      </div>
                    </div>
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
