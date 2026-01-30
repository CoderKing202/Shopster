import React from "react";
import { Link } from "react-router-dom";

function Categories(props) {
  const formatCategory = (item) => {
    return item.replace(/\s+/g, "-");
  };

  const categoryImages = {
    "Smartphones": "https://img.icons8.com/color/48/000000/smartphone-tablet.png",
    "Mens Shirts": "https://img.icons8.com/color/48/000000/t-shirt.png",
    "sunglasses": "https://img.icons8.com/?size=100&id=IYyZyQ9av9Vf&format=png&color=000000",
    "Groceries": "https://img.icons8.com/color/48/000000/grocery-bag.png",
    "Beauty": "https://img.icons8.com/?size=100&id=IBrm3QaSliRg&format=png&color=000000",
    "Laptops": "https://img.icons8.com/color/48/000000/laptop.png",
    "Vehicle": "https://img.icons8.com/color/48/000000/car.png",
    "Womens Dresses": "https://img.icons8.com/?size=100&id=wnvt611YOdl7&format=png&color=000000",
    "Womens Jewellery": "https://img.icons8.com/color/48/000000/necklace.png",
    "Skin Care": "https://img.icons8.com/?size=100&id=Ak6m3QqxI55E&format=png&color=000000",
  };

  return (
    <div className="bg-white py-2 mb-3">
      <div
        className="d-flex flex-wrap justify-content-center justify-content-md-between text-center gap-3 px-2"
        style={{ overflowX: "auto", whiteSpace: "nowrap" }}
      >
        {Object.keys(categoryImages).map((item) => (
          <Link
            key={item}
            to={`/category/${formatCategory(item).toLowerCase()}`}
            className="text-decoration-none text-dark"
          >
            <div className="d-flex flex-column align-items-center small" style={{ minWidth: "70px" }}>
              <div
                className="rounded-circle bg-light mb-1 d-flex align-items-center justify-content-center"
                style={{ width: "40px", height: "40px" }}
              >
                <img
                  src={categoryImages[item]}
                  alt={item}
                  style={{ width: "70%", height: "70%", objectFit: "contain" }}
                />
              </div>
              <span>{item}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Categories;
