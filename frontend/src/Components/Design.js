import React from 'react'
import { Link } from "react-router-dom";

export default function Design() {
  return (
    <div style={{ paddingLeft: "40px", textAlign: "left"}}>
    <h2>Why Thousands Trust Book Hive</h2>
    <div style={{display:'flex',gap:'15px'}}>
    <div className="design">
    <i className="fa-solid fa-truck fa-2x" style={{ marginRight: "15px" }}></i>
    <div>
    <h4 style={{ margin: 0, fontSize:'18px'}}>Free Delivery</h4>
    <p style={{ margin: 0, fontSize:'14px' }}>Across all of Pakistan</p>
    </div>
    </div>
    <div className="design">
    <i className="fa-solid fa-arrow-rotate-left fa-2x" style={{ marginRight: "15px" }}></i>
    <div>
    <h4 style={{ margin: 0,fontSize:'18px' }}>Easy 7-Day Return</h4>
    <p style={{ margin: 0 ,fontSize:'14px'}}>Free return policy</p>
    </div>
    </div>
    <div className="design">
    <i className="fa-solid fa-handshake fa-2x" style={{ marginRight: "15px" }}></i>
    <h4 style={{ margin: 0, fontSize:'18px' }}>Trusted by 1,000+ Readers</h4>
    <p style={{ margin: 0, fontSize:'14px'}}>No Low-Quality Prints, No Compromise</p>
    </div>
    </div>
    <div style={{display:'flex', justifyContent:'center'}}>
    <Link to="/products">
    <button className="show-btn" style={{ marginBottom: "70px"}}>
    Shop Books now
    </button>
    </Link>
    </div>
    </div>
  );
}

