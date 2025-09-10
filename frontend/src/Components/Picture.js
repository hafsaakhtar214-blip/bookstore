import React from 'react';
import { Link } from "react-router-dom";

export default function Picture() {
  return (
    <>
    <div className="pic">
    <div className="hero-text">
    <h1 style={{ fontSize: "40px"}}>Book Hive - Buy Books with Free Delivery</h1>
    <Link to="/products">
    <button className='btnm'>Buy Books Now</button>
    </Link>
    </div>
    <img src="/Screenshot_9.png" alt="normal" className="normal" />
    <img src="/md.png" alt="hover" className="hover" />
    </div>
      </>
  );
}
