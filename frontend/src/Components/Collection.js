import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Collection() {
  const navigate = useNavigate();
  const goToGenre = (genre) => {
    navigate(`/products?genre=${genre}`);
  };

  return (
    <div>
    <h1 style={{ fontSize: "33px", fontWeight: "bold", textAlign: "center", marginTop:"58px"}}>Collections</h1>
    <div className="contain"> 
    <div className="collect">
      <button onClick={() => goToGenre("Literature")}>
      <img src="classic.png" alt="Classic Collection" />
      </button>
      </div>
      <div className="collect">
      <button onClick={() => goToGenre("Mystery")}>
      <img src="mystery.png" alt="Mystery Collection" />
      </button>
      </div>
      <div className="collect">
      <button onClick={() => goToGenre("Fiction")}>
      <img src="fantasy.png" alt="Fantasy Collection" />
      </button>
      </div>
      <div className="collect">
      <button onClick={() => goToGenre("Thriller")}>
      <img src="thriller.png" alt="Thriller Collection" />
      </button>
      </div>
      </div>
    </div>
  );
}
