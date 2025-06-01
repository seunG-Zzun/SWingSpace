import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      alert('관리자 권한이 필요합니다.');
      navigate('/');
    } else {
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.data);
    } catch (err) {
      alert('사용자 목록 조회 실패');
    }
  };

  const addWarning = async (studentId) => {
    try {
      const res = await axios.post(`/admin/users/${studentId}/warning`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
      fetchUsers();
    } catch (err) {
      alert('경고 추가 실패');
    }
  };

  const removeUser = async (studentId) => {
    if (!window.confirm('정말 탈퇴 처리하시겠습니까?')) return;
    try {
      const res = await axios.delete(`/admin/users/${studentId}/remove`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
      fetchUsers();
    } catch (err) {
      alert('탈퇴 실패');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>👑 관리자 대시보드</h2>
      <p>동아리: {user?.club}</p>

      {users.length === 0 ? (
        <p>회원 목록이 없습니다.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>이름</th>
              <th>학번</th>
              <th>권한</th>
              <th>경고 수</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {users.filter(u => u.club === user.club && u.role !== 'admin').map(u => (
              <tr key={u.studentId}>
                <td>{u.name}</td>
                <td>{u.studentId}</td>
                <td>{u.role}</td>
                <td>{u.warningCount}</td>
                <td>
                  <button onClick={() => addWarning(u.studentId)}>⚠ 경고</button>
                  <button onClick={() => removeUser(u.studentId)}>❌ 탈퇴</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;
