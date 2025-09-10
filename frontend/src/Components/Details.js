import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Details() {
  const [book, setBook] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:4000/books/${id}`)
      .then((res) => setBook(res.data))
      .catch((err) => console.error("Error fetching book:", err));
  }, [id]);

  if (!book) {
    return <h2 className="loading-text">Loading...</h2>;
  }

  return (
    <div className="details-container" style={{ paddingTop:'120px'}}>
      <div className="details-image">
        <img src={`http://localhost:4000${book.image}`} alt={book.book_name} />
      </div>
      <div className="details-info">
        <h1>{book.book_name}</h1>
        <p>
          <b>Author:</b> {book.author_name}
        </p>
        <p>
          <b>Genre:</b> {book.genre_name}
        </p>
        <p>
          <b>Published:</b>{" "}
          {new Date(book.published_date).toDateString()}
        </p>
        <p>
          <b>ISBN:</b> {book.ISBN}
        </p>
        <p className="details-price">Price: {book.price} pkr</p>
     <button className="cartbtn" style={{ marginBottom: "8px",width:'150px',height:'40px', fontSize:'15px',marginTop:'10px'}}>
              Add to Cart
            </button>
      </div>
    </div>
  );
}
