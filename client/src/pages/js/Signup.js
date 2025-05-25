import React, { useState } from 'react';
import axios from 'axios';
import '../css/Signup.css';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    studentId: '',
    password: '',
    role: '',
    club: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/users/signup', form);
      alert(res.data.message);
      navigate('/');

    } catch (err) {
      alert(err.response?.data?.message || '회원가입 실패');
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input name="name" placeholder="이름" onChange={handleChange} required />
        <input name="studentId" placeholder="학번" onChange={handleChange} required />
        <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} required />
        <select name="club" onChange={handleChange} required>
            <option value="">--동아리 선택--</option>
            <option value="AIM">AIM</option>
            <option value="DOUM">DO, UM</option>
            <option value="KOBOT">KOBOT</option>
            <option value="KOSS">KOSS</option>
            <option value="KPSC">KPSC</option>
            <option value="Shooting">Shooting</option>
            <option value="WINK">WINK</option>
        </select>
        <select name="role" onChange={handleChange} required>
            <option value="">--선택하세요--</option>
            <option value="user">동아리원</option>
            <option value="admin">동아리장</option>
        </select>
        
        <button type="submit">가입하기</button>
      </form>
    </div>
  );
}

export default Signup;