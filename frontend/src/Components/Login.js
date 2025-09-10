import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/login', { email, password });
      sessionStorage.setItem('token', res.data.token);
      window.dispatchEvent(new Event('login'));
      navigate('/'); 
    } catch (err) {
      setMessage(err.response?.data?.message || "Login error");
    }
  };

  return (
    <div className="signmain">
    <div className="signcenter">
    <div className="sign">
    <h2 className="center">LOG IN</h2>
    <form onSubmit={handleSubmit}>
    <div className="label">
    <label>Email:</label><br />
    <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your Email" required /><br/>
    <label>Password:</label><br />
    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your Password" required />
    </div>
    <button className="enterbtn" type="submit">Enter</button>
    </form>
    {message && <p style={{ color: 'white', marginTop: '10px', fontSize:'18px' }}>{message}</p>}
    <h5 className="center" style={{ marginBottom: "2px" }}>Don't have an account? Want to create it?</h5>
    <a href="/signup">
    <p style={{ color: "rgb(186, 186, 231)", fontWeight: "bold", textDecoration: "underline", marginTop: "0" }}>CREATE ACCOUNT</p>
    </a>
    </div>
    </div>
    </div>
  );
}
