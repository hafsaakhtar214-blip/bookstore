import React, { useEffect, useState } from "react";

export default function Admindelete() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("http://localhost:4000/books");
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error("Failed to fetch products:", err);
            }
        };
        fetchProducts();
    }, []);

    const handleDelete = async () => {
        if (!selectedProduct) {
            alert("Please select a product first!");
            return;
        }

        try {
            const token = sessionStorage.getItem("token");

            const res = await fetch(
                `http://localhost:4000/books/${selectedProduct}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (!res.ok) throw new Error("Delete failed");

            alert("Product deleted successfully!");
            setProducts((prev) =>
                prev.filter((p) => p.id !== parseInt(selectedProduct))
            );
            setSelectedProduct("");
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete product.");
        }
    };

    return (
        <div style={{
            paddingTop: "30px",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>
            <h1 style={{ marginTop: '30px', marginBottom: '30px', fontSize: '40px', textDecoration: 'underline' }}>BOOK HIVE</h1>
            <h2 style={{ fontSize: '40px' }}>DELETE PRODUCT</h2>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "300px",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "100px",
                    marginTop: "30px",
                    marginBottom: "200px"
                }}
            >
                <label style={{ marginBottom: "10px", fontSize: "20px" }}>
                    Select the book:
                </label>

                <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    style={{
                        padding: "10px",
                        marginBottom: "20px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        backgroundColor: "#f9f9f9",
                        color: "#333",
                        fontSize: "16px",
                        cursor: "pointer",
                        width: "100%",
                    }}
                >
                    <option value="">-- Select Product --</option>
                    {products.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.book_name}
                        </option>
                    ))}
                </select>

                <button onClick={handleDelete} className="checkout-btn">
                    Delete
                </button>
            </div>
        </div>
    );
}
