import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar({ title }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (token) {
      fetch("http://localhost:4000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then((data) => {
          console.log("Profile data:", data);
          if (data.email) setUser(data.email.split("@")[0]);
        })
        .catch((err) => {
          console.log("Error fetching profile:", err);
          localStorage.removeItem("token");
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, [token]);

 const fetchCartCount = async () => {
  const token = sessionStorage.getItem("token");
  if (!token) return setCartCount(0);
  try {
    if (sessionStorage.getItem("cartCleared")) {
      setCartCount(0);
      sessionStorage.removeItem("cartCleared"); 
      return;
    }

    const res = await fetch("http://localhost:4000/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCartCount(data.cartItems?.length || 0);
  } catch (err) {
    console.error(err);
    setCartCount(0);
  }
};


  useEffect(() => {
    const handleLoginEvent = () => {
      const newToken = sessionStorage.getItem("token");
      setToken(newToken);
    };
    window.addEventListener("login", handleLoginEvent);
    return () => window.removeEventListener("login", handleLoginEvent);
  }, []);

  useEffect(() => {
    fetchCartCount();
    const handleCartChange = () => fetchCartCount();
    window.addEventListener("cartChange", handleCartChange);
    return () => window.removeEventListener("cartChange", handleCartChange);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
    setDropdownOpen(false);
    navigate("/login");
  };

  const goToGenre = (genre, genreId) => {
    navigate(`/products?genre=${genre}&genreId=${genreId}`);
  };

  return (
    <div className="nav">
      <div className="nav1">
        <Link to="/">
          <button className="heading">{title}</button>
        </Link>
      </div>
      <div className="nav2">
        <Link to="/products">
          <button className="btns btns1">All Products</button>
        </Link>
        <button className="btns btns2" onClick={() => goToGenre("Fiction", 1)}>
          Fiction
        </button>
        <button
          className="btns btns1"
          onClick={() => goToGenre("Non-Fiction", 2)}
        >
          NonFiction
        </button>
        <button
          className="btns btns1"
          onClick={() => goToGenre("Literature", 3)}
        >
          Literature
        </button>
        <button className="btns btns3" onClick={() => goToGenre("Poetry", 4)}>
          Poetry
        </button>
        <Link to="/about">
          <button className="btns btns1">About us</button>
        </Link>
        <Link to="/search">
          <button className="btns icon" style={{ marginLeft: "55px" }}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </Link>
        {user ? (
          <div style={{ position: "relative", display: "inline-block" }}>
            <button
              className="btns icon"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {user} <i className="fa-solid fa-caret-down"></i>
            </button>
            {dropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  minWidth: "100px",
                  textAlign: "center",
                  zIndex: 1000,
                }}
              >
                <button
                  onClick={handleLogout}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "8px",
                    width: "100%",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button className="btns icon">
              <i className="fa-solid fa-user"></i>
            </button>
          </Link>
        )}
        <Link to="/cart">
          <button className="btns icon" style={{ position: "relative" }}>
            <i className="fa-solid fa-cart-shopping"></i>
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  background: "red",
                  color: "#fff",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "12px",
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </Link>
      </div>
    </div>
  );
}
