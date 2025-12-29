import React from 'react'
import { Link } from 'react-router-dom'

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">

          {/* CENTER GROUP : Shopster + Links */}
          <div className="d-flex align-items-center mx-auto">

            {/* Shopster (left of links) */}
            <Link className="navbar-brand me-4" to="/">
              Shopster
            </Link>

            {/* Links */}
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item mx-4">
                <Link className="nav-link active" to="/">Home</Link>
              </li>

              <li className="nav-item mx-4">
                <Link className="nav-link" to="/link">Link</Link>
              </li>

              <li className="nav-item dropdown mx-4">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Dropdown
                </Link>

                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="#">Action</Link></li>
                  <li><Link className="dropdown-item" to="#">Another action</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="#">Something else here</Link></li>
                </ul>
              </li>

              <li className="nav-item mx-4">
                <span className="nav-link disabled">Disabled</span>
              </li>
            </ul>

          </div>

          {/* RIGHT : Search */}
          <form className="d-flex me-3" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>

        </div>
      </div>
    </nav>
  )
}

export default NavBar
