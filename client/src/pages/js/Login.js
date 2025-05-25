import React, { useState } from 'react';
import axios from 'axios';
import '../css/Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    studentId: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/users/login', form);
      alert(res.data.message);
      navigate('/reservation');
    } catch (err) {
      alert(err.response?.data?.message || '로그인 실패');
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input name="studentId" placeholder="학번" onChange={handleChange} required />
        <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} required />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default Login;