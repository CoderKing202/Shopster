
import React, { use, useState } from "react";
import Corousel from "./Corousel";
import { useEffect } from "react";
import axios from "axios";
import Categories from "./Categories";

function Home(props) {
  const [slideImages,setslideImages] = useState([])
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://dummyjson.com/products?limit=5");

      const products = res.data.products;

      // create array of 5 image URLs (first image of each product)
      const imageUrls = products.map(product => product.images[0]);

      setslideImages(imageUrls);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  fetchProducts();
}, []);

console.log(slideImages)
  return (
    <div className="bg-light">
      <div className="container py-2">
        
     

        {/* Hero banner */}
       <Corousel images={slideImages}/>
<Categories/>        {/* First product row */}
        <SectionRow title="Featured Items">
          <ProductCard title="Item A" subtitle="Extra info" />
          <ProductCard title="Item B" subtitle="Extra info" />
          <ProductCard title="Item C" subtitle="Extra info" />
          <ProductCard title="Item D" subtitle="Extra info" />
          <ProductCard title="Item E" subtitle="Extra info" />
          <ProductCard title="Item F" subtitle="Extra info" />
        </SectionRow>

        {/* Three columns of product grids */}
        <div className="row g-3">
          <SectionGrid title="Section One">
            <ProductCard title="Item 1" subtitle="Tag 1" />
            <ProductCard title="Item 2" subtitle="Tag 2" />
            <ProductCard title="Item 3" subtitle="Tag 3" />
            <ProductCard title="Item 4" subtitle="Tag 4" />
          </SectionGrid>

          <SectionGrid title="Section Two">
            <ProductCard title="Item 5" subtitle="Tag 5" />
            <ProductCard title="Item 6" subtitle="Tag 6" />
            <ProductCard title="Item 7" subtitle="Tag 7" />
            <ProductCard title="Item 8" subtitle="Tag 8" />
          </SectionGrid>

          <SectionGrid title="Section Three">
            <ProductCard title="Item 9" subtitle="Tag 9" />
            <ProductCard title="Item 10" subtitle="Tag 10" />
            <ProductCard title="Item 11" subtitle="Tag 11" />
            <ProductCard title="Item 12" subtitle="Tag 12" />
          </SectionGrid>
        </div>
      </div>
    </div>
  );
}

function SectionRow({ title, children }) {
  return (
    <section className="bg-white p-3 mb-3 rounded">
      <h5 className="mb-3">{title}</h5>
      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-3">
        {children}
      </div>
    </section>
  );
}

function SectionGrid({ title, children }) {
  return (
    <section className="col-12 col-md-4">
      <div className="bg-white p-3 rounded h-100">
        <h5 className="mb-3">{title}</h5>
        <div className="row row-cols-2 g-3">{children}</div>
      </div>
    </section>
  );
}

function ProductCard({ title, subtitle }) {
  return (
    <div className="col">
      <div className="border rounded text-center p-2 h-100">
        <div
          className="bg-light mb-2"
          style={{ width: "100%", height: "100px" }}
        />
        <p className="mb-1 small">{title}</p>
        {subtitle && <p className="mb-0 text-muted small">{subtitle}</p>}
      </div>
    </div>
  );
}

export default Home;
