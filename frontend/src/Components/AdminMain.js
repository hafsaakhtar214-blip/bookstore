import React from "react";
import { Link } from "react-router-dom";

export default function AdminMain() {
  return (
    <div>
      <h1
        style={{
          marginTop: "30px",
          marginBottom: "30px",
          fontSize: "40px",
          textDecoration: "underline",
        }}
      >
        BOOK HIVE
      </h1>
      <h2 style={{ fontSize: "33px" }}>ADMIN PANEL</h2>

      <Link to="/addproduct">
        <button className="adminbtn">Add Product</button>
      </Link>

      <Link to="/deleteproduct">
        <button className="adminbtn">Delete Product</button>
      </Link>
    </div>
  );
}
