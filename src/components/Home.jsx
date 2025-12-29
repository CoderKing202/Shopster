import React from "react";

function Home() {
  return (
    <div className="bg-light">
      <div className="container py-2">
        {/* Top category bar */}
        <div className="bg-white d-flex justify-content-between text-center py-2 mb-3">
          {[
            "Category 1",
            "Category 2",
            "Category 3",
            "Category 4",
            "Category 5",
            "Category 6",
            "Category 7",
            "Category 8",
            "Category 9",
          ].map((item) => (
            <div key={item} className="d-flex flex-column align-items-center small">
              <div
                className="rounded-circle bg-light mb-1"
                style={{ width: "40px", height: "40px" }}
              />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Hero banner */}
        <div className="bg-primary text-white d-flex justify-content-between align-items-center px-4 py-4 rounded mb-3">
          <div>
            <h3 className="mb-1">Hero Title</h3>
            <h4 className="mb-1">Some Highlight Text</h4>
            <p className="mb-0">Short description about this banner</p>
          </div>
          <div
            className="bg-white rounded"
            style={{ width: "260px", height: "160px" }}
          />
        </div>

        {/* First product row */}
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
