import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]); 
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      axios
        .get(`http://localhost:4000/books/search?q=${encodeURIComponent(query)}`)
        .then((res) => setResults(res.data))
        .catch((err) => console.log(err));
    }, 300); 

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div style={{ textAlign: "center", padding: "20px", paddingTop: "120px" }}>
      <label style={{ fontSize: "20px" }}>Search:&nbsp;&nbsp;</label>
      <input
        type="text"
        placeholder="Search books..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: "6px 10px", fontSize: "16px", width: "300px" }}
      />

      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
          justifyItems: "center",
        }}
      >
        {results.map((book) => (
          <div
            key={book.id}
            style={{
              width: "200px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              backgroundColor: "#f9f9f9",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
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
                marginBottom: "8px",
              }}
            />
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ margin: "6px 0 2px 0", fontSize: "15px", color: "black" }}>
                {book.book_name}
              </h3>
              <p style={{ margin: 0, fontSize: "14px", color: "black" }}>
                Rs.{book.price}
              </p>
            </div>
             </Link>
            <button className="cartbtn" style={{marginTop:'4px'}}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
