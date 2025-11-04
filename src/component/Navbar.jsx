import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            🛍 Product Dashboard
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link
                  to="/"
                  className={`nav-link ${
                    location.pathname === "/" ? "active fw-semibold" : ""
                  }`}
                >
                  Add Product
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/list"
                  className={`nav-link ${
                    location.pathname === "/list" ? "active fw-semibold" : ""
                  }`}
                >
                  Product List
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container">
        <Outlet />
      </div>
    </>
  );
};

export default Navbar;
