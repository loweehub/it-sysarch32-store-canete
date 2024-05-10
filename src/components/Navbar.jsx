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
        {}
        <Link to="/cart" className="cartBtn">
          Cart ({cartItems})
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;