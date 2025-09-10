import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";

export default function Product({ books: propBooks }) {
  const [books, setBooks] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const genre = queryParams.get("genre");

  useEffect(() => {
    if (propBooks) {
      setBooks(propBooks);
      return;
    }

    let url = "http://localhost:4000/books";
    if (genre) {
      url = `http://localhost:4000/books/collections/${genre}`;
    }

    axios
      .get(url)
      .then((res) => setBooks(res.data))
      .catch((err) => console.log(err));
  }, [genre, propBooks]);

const addToCart = async (bookId) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    alert("Please log in first!");
    return;
  }

  try {
    const res = await fetch("http://localhost:4000/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ book_id: bookId }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to add to cart");
      return;
    }
    alert(data.message);
    window.dispatchEvent(new Event("cartChange"));
  } catch (err) {
    console.error("Network/server error:", err);
    alert("Network or server error");
  }
};

  return (
    <div className="product" style={{ paddingTop: "120px" }}>
      <h1
        style={{
          marginBottom: "40px",
          fontSize: "30px",
          textAlign: "center",
          marginTop: "14px",
        }}
      >
        {genre ? `${genre} Books` : "Products"}
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
          gridRowGap: "40px",
          justifyItems: "center",
        }}
      >
        {books.map((book) => (
          <div
            key={book.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              textAlign: "center",
              backgroundColor: "#f9f9f9",
              width: "220px",
              height: "260px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "10px",
            }}
          >
            <Link to={`/books/${book.id}`} style={{ textDecoration: "none" }}>
              <img
                src={`http://localhost:4000${book.image}`}
                alt={book.book_name}
                style={{
                  width: "100%",
                  height: "140px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
              <div>
                <h3
                  style={{
                    margin: "6px 0 2px 0",
                    fontSize: "15px",
                    color: "black",
                  }}
                >
                  {book.book_name}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "black",
                    marginBottom: "5px",
                  }}
                >
                  Rs.{book.price}
                </p>
              </div>
            </Link>
            <button
              className="cartbtn"
              style={{ marginBottom: "8px", cursor: "pointer" }}
              onClick={() => addToCart(book.id)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
