import React, { useState } from "react";

export default function Admin() {
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    genre: "",
    published_date: "",
    pages: "",
    isbn: "",
    price: "",
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (
      !formData.name ||
      !formData.author ||
      !formData.genre ||
      !formData.published_date ||
      !formData.pages ||
      !formData.isbn ||
      !formData.price ||
      !image
    ) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    data.append("image", image);

    try {
      const response = await fetch("http://localhost:4000/createproduct", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      const result = await response.json();
      alert(result.message);
      console.log(result);
      setFormData({
        name: "",
        author: "",
        genre: "",
        published_date: "",
        pages: "",
        isbn: "",
        price: "",
      });
      setImage(null);

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div >
    <h1 style={{marginTop:'30px', marginBottom:'30px', fontSize:'40px',textDecoration:'underline'}}>BOOK HIVE</h1>
    <h2 style={{fontSize:'33px'}}>ADD PRODUCT</h2>
    <form className="adminform" onSubmit={handleSubmit}>
      <h3>Book Name:</h3>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Enter the book name" />
      <h3>Author:</h3>
      <input name="author" value={formData.author} onChange={handleChange} placeholder="Enter the author name"/>
      <h3>Genre:</h3>
      <input name="genre" value={formData.genre} onChange={handleChange} placeholder="Enter the genre"/>
      <h3>Published Date:</h3>
      <input type="date" name="published_date" value={formData.published_date} onChange={handleChange} />
      <h3>Pages:</h3>
      <input type="number" name="pages" value={formData.pages} onChange={handleChange} placeholder="Enter the no of pages"/>
      <h3>ISBN:</h3>
      <input name="isbn" value={formData.isbn} onChange={handleChange} placeholder="Enter the ISBN"/>
      <h3>Price:</h3>
      <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Enter the price"/>
      <h3>Image:</h3>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <br />
      <button type="submit" className="adminform-btn">Submit</button>
    </form>
    </div>
  );
}
