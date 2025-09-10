import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;
    if (sessionStorage.getItem("cartCleared")) {
      setCartItems([]);
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const merged = [];
      data.cartItems?.forEach((item) => {
        const existing = merged.find((i) => i.book_id === item.book_id);
        if (existing) {
          existing.quantity += item.quantity; // increase qty
        } else {
          merged.push({ ...item });
        }
      });

      setCartItems(merged || []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCartItems([]);
    }
  };

  const removeItem = async (book_id) => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`http://localhost:4000/cart/${book_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems((prev) => prev.filter((item) => item.book_id !== book_id));
      window.dispatchEvent(new Event("cartChange"));
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const updateQuantity = async (book_id, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.book_id === book_id ? { ...item, quantity: newQuantity } : item
      )
    );

    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`http://localhost:4000/cart/update/${book_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  useEffect(() => {
    fetchCart();

    const handleCartChange = () => fetchCart();
    window.addEventListener("cartChange", handleCartChange);

    return () => {
      window.removeEventListener("cartChange", handleCartChange);
    };
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.item_price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 && <p>Your cart is empty</p>}

      {cartItems.map((item) => (
        <div className="cart-item" key={item.book_id}>
          <img
            src={`http://localhost:4000${item.image || "/placeholder.jpg"}`}
            alt={item.title}
            className="cart-item-img"
          />
          <div className="cart-item-info">
            <h4>{item.title}</h4>
            <p>
              Rs.{item.item_price} x {item.quantity} = Rs.
              {item.item_price * item.quantity}
            </p>
            <div className="quantity-control">
              <button
                onClick={() => updateQuantity(item.book_id, item.quantity - 1)}
              >
                <i className="fa-solid fa-minus"></i>
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.book_id, item.quantity + 1)}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
          <button
            className="remove-btn"
            onClick={() => removeItem(item.book_id)}
          >
            <i className="fa-solid fa-delete-left fa-2x"></i>
          </button>
        </div>
      ))}

      <h3 style={{ marginBottom: "10px" }}>Total: Rs.{total}</h3>
      {cartItems.length > 0 && (
        <Link
          to="/checkout"
          state={{ cartItems, total }}
          className="checkout-btn"
          style={{ marginTop: "10px" }}
        >
          Continue to Delivery
        </Link>
      )}
    </div>
  );
}
