import React from "react";
import { Link } from "react-router-dom";

function Navbar({ cartItems }) {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light"
      style={{
        paddingTop: 16,
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      <div className="container-fluid">
        <Link
          className="navbar-brand"
          to="/"
          style={{ color: "inherit", textDecoration: "none", fontSize: "24px" }}
        >
          Shoe Symphony
        </Link>
        {/* Search Bar */}
        <form className="d-flex ms-auto">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button className="btn btn-outline-success" type="submit">
            Search
          </button>
        </form>
        
        <Link to="/cart" className="cartBtn">
          Cart ({cartItems})
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
