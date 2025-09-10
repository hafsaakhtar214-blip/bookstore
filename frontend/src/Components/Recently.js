import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {Link } from "react-router-dom";

function Recently() {
    const [books, setBooks] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        axios.get('http://localhost:4000/books/recently-added')
        .then(res => setBooks(res.data))
        .catch(err => console.log(err));
    }, []);

    const scrollLeft = () => {
        scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    };

    const scrollRight = () => {
        scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    };

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
        <>
        <div style={{ position: 'relative', padding: '20px 0' }}>
        <button onClick={scrollLeft} className="scroll scroll-left">
        <i className="fa-solid fa-arrow-left"></i>
        </button>
        <button onClick={scrollRight} className="scroll scroll-right">
        <i className="fa-solid fa-arrow-right"></i>
        </button>
        <div
        ref={scrollRef}
        style={{
        display: 'flex',
        overflowX: 'hidden',
        gap: '20px',
        padding: '10px 50px',
        }}
        >
        {books.length === 0 ? (<p>No books found.</p>) : (
        books.map(book => (<div
        key={book.id}
        style={{
        width: '200px',
        height: '310px',
        border: '1px solid #ccc',
        padding: '10px',
        textAlign: 'center',
        flex: '0 0 auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        }}
        >
        <Link to={`/books/${book.id}`} style={{ textDecoration: "none" }}>
        <img
        src={`http://localhost:4000${book.image}`}
        alt={book.book_name}
        style={{
        width: '100%',
        height: '180px',
        objectFit: 'cover',
        borderRadius: '4px',
        marginBottom: '10px'
        }}
        />
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'black', marginBottom: '0' }}>
        {book.book_name}</h3>
        <p style={{ margin: '0', color: 'black', fontWeight: '500', textDecoration: 'none' }}>Rs.
        {book.price ? `${book.price}` : "Rs.0"}</p>
        </Link>
        <button className="cartbtn" style={{ marginTop: '8px' }} onClick={() => addToCart(book.id)}>Add to Cart</button>
        </div>
        ))
        )}
        </div>
        </div>
        <Link to="/products">
        <button className="show-btn" style={{ marginBottom: "70px" }}>Show More</button>
        </Link>
        </>
    );
}

export default Recently;
