import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
function Carousel({ products = [] }) {
  const [slideImages,setslideImages] = useState([])
  useEffect(()=>{
    const imageUrls = products.map(product => product.images[0]);
    console.log(imageUrls)
  },[])
  return (
    <div id="carouselExampleDark" className="carousel carousel-dark slide" data-bs-ride="carousel">
      
      {/* Indicators */}
      <div className="carousel-indicators">
        {products.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : undefined}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Slides */}
      <div className="carousel-inner">
        {products.map((product, index) => 
        (
          <Link key={index} to={`/product/${product.id}`}>
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
            data-bs-interval="3000"
          >
            <img src={product.images[0]} className="d-block w-100" alt={`Slide ${index + 1}`} />
          </div>
          </Link>
        ))}
      </div>

      {/* Controls */}
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>

      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>

    </div>
  );
}

export default Carousel;
