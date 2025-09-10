import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function CheckoutForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { cartItems = [], total = 0 } = state || {};
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    zip: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.city ||
      !formData.zip ||
      !formData.address
    ) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch("http://localhost:4000/cart/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ formData }), 
      });

      if (!res.ok) {
        throw new Error("Checkout failed");
      }

      sessionStorage.setItem("cartCleared", "true");
      sessionStorage.setItem("cartCount", "0");
      window.dispatchEvent(new Event("cartChange"));

      alert("Order placed successfully!");
      navigate("/");
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Failed to place order. Try again.");
    }
  };

  return (
    <div className="checkoutform">
      <h1>Delivery Form</h1>
      <form onSubmit={handleSubmit}>
        <h3>Full Name:</h3>
        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />
        <h3>Phone Number:</h3>
        <input
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
        />
        <h3>City:</h3>
        <input
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
        />
        <h3>Zip code:</h3>
        <input
          name="zip"
          placeholder="Zip Code"
          value={formData.zip}
          onChange={handleChange}
        />
        <h3>Address:</h3>
        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />

        <h4 style={{ marginTop: "9px" }}>Total: Rs.{total}</h4>
        <button type="submit" className="checkout-btn">
          Checkout
        </button>
      </form>
    </div>
  );
}
