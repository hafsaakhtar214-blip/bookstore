import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Sign() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (password !== confirm) return setMessage("Passwords do not match");

  try {
    await axios.post('http://localhost:4000/signup', { email, password });
    const loginRes = await axios.post('http://localhost:4000/login', { email, password });
    sessionStorage.setItem('token', loginRes.data.token);
    window.dispatchEvent(new Event('login'));
    navigate('/');
  } catch (err) {
    setMessage(err.response?.data?.message || 'Error');
  }
};

  return (
    <div className="signmain">
    <div className="signcenter">
    <div className="sign">
    <h2 className="center">SIGN UP</h2>
    <form onSubmit={handleSubmit}>
    <div className="label">
    <label>Email:</label><br/>
    <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your Email" required /><br/>
    <label>Password:</label><br/>
    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create your Password" required /><br/>
    <label>Confirm Password:</label><br/>
    <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm your Password" required />
    </div>
    <button className="enterbtn" type="submit">Create</button>
    </form>
    {message && <p>{message}</p>}
    </div>
    </div>
    </div>
  );
}
