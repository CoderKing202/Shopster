import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "./state";
import { bindActionCreators } from "redux";


function NavBar() {
  const items = useSelector(state=>state.cartItems) 
  const navigate = useNavigate();
  const loginDispatch = useDispatch();
  const { logStatus } = bindActionCreators(actionCreators, loginDispatch);
  const collapseRef = useRef(null);
  const logStat = useSelector((state) => state.logStatus);

  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const logOut = () => {
    localStorage.removeItem("token");
    logStatus(false);
    navigate("/");
  };

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => res.json())
      .then((data) => setProducts(data.products));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim() === "") {
        setFiltered([]);
      } else {
        const q = query.toLowerCase();
        setFiltered(
          products.filter((p) => p.title.toLowerCase().includes(q)).slice(0, 6)
        );
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [query, products]);

  const closeMenu = () => {
    const el = document.getElementById("navbarContent");
    if (el?.classList.contains("show")) {
      el.classList.remove("show");
    }
  };

  const handleSelect = (id) => {
    setQuery("");
    setFiltered([]);
    setHighlightedIndex(-1);
    navigate(`/product/${id}`);
    closeMenu();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search/${encodeURIComponent(query.trim())}`);
    setFiltered([]);
    setHighlightedIndex(-1);
    closeMenu();
  };

  const handleKeyDown = (e) => {
    if (!filtered.length) return;

    if (e.key === "ArrowDown") {
      setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      handleSelect(filtered[highlightedIndex].id);
    }
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const i = text.toLowerCase().indexOf(query.toLowerCase());
    if (i === -1) return text;
    return (
      <>
        {text.slice(0, i)}
        <strong>{text.slice(i, i + query.length)}</strong>
        {text.slice(i + query.length)}
      </>
    );
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/" onClick={closeMenu}>
          Shopster
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarContent"
          ref={collapseRef}
        >
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" to="/" onClick={closeMenu}>
                Home
              </Link>
            </li>
          </ul>

          <form
            onSubmit={handleSearchSubmit}
            className="position-relative mx-lg-auto my-2 my-lg-0 d-flex"
            style={{ width: "100%", maxWidth: "550px" }}
          >
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>

            {filtered.length > 0 && (
              <ul
                className="list-group position-absolute w-100 shadow"
                style={{ top: "100%", zIndex: 1000 }}
              >
                {filtered.map((p, i) => (
                  <li
                    key={p.id}
                    className={`list-group-item list-group-item-action ${
                      i === highlightedIndex ? "active" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHighlightedIndex(i)}
                    onClick={() => handleSelect(p.id)}
                  >
                    {highlightMatch(p.title, query)}
                  </li>
                ))}
              </ul>
            )}
          </form>

          <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-3 ms-lg-auto mt-3 mt-lg-0">
            {!logStat ? (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-primary w-100 w-lg-auto"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary w-100 w-lg-auto"
                  onClick={closeMenu}
                >
                  Signup
                </Link>
              </>
            ) : (
              <Link
                to="/"
                className="btn btn-primary w-100 w-lg-auto"
                onClick={() => {
                  logOut();
                  closeMenu();
                }}
              >
                LogOut
              </Link>
            )}

            <div className="d-flex gap-3">
              {/* Cart with badge */}
              <Link to="/cart" className="position-relative">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/263/263142.png"
                  alt="Cart"
                  width="28"
                />
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.65rem" }}
                >
                  {items.length}
                </span>
              </Link>

              <Link to="/userProfile">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  alt="Profile"
                  width="28"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
