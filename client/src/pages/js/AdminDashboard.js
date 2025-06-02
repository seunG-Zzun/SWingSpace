import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState([]);
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      alert('❌ 관리자 권한이 필요합니다.');
      navigate('/');
    } else {
      fetchDashboard();
    }
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`/admin/dashboard?studentId=${user.studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(res.data.data);
    } catch (err) {
      alert('대시보드 데이터 조회 실패');
    }
  };

  const addWarning = async (studentId) => {
    try {
      const res = await axios.post(`/admin/users/${studentId}/warning`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
      fetchDashboard();
    } catch (err) {
      alert('⚠ 경고 추가 실패');
    }
  };
  const cancelWarning = async (studentId) => { //tmp
    try {
      const res = await axios.post(`/admin/users/${studentId}/cancelWarning`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
      fetchDashboard();
    } catch (err) {
      const msg = err.response?.data?.message || '경고 취소 중 오류 발생';
      alert(msg);
    }
  };

  const removeUser = async (studentId) => {
    if (!window.confirm('정말 해당 사용자를 탈퇴시키겠습니까?')) return;
    try {
      const res = await axios.delete(`/admin/users/${studentId}/remove`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
      fetchDashboard();
    } catch (err) {
      alert('❌ 탈퇴 실패');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>👑 관리자 대시보드</h2>
      <p>동아리: {user?.club}</p>

      {dashboardData.length === 0 ? (
        <p>회원 정보가 없습니다.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>학번</th>
              <th>경고 수</th>
              <th>정지 여부</th>
              <th>미반납 수</th>
              <th>미반납 상세</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.map(u => (
              <tr key={u.studentId}>
                <td>{u.studentId}</td>
                <td>{u.warningCount}</td>
                <td>{u.isBanned ? '✅ 정지' : '❌ 정상'}</td>
                <td>{u.unreturnedCount}</td>
                <td>
                  <ul>
                    {u.unreturnedDetails.map(r => (
                      <li key={r.reservationId}>{r.timeRangeStr}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <button onClick={() => addWarning(u.studentId)}>⚠ 경고</button>
                  <button onClick={() => cancelWarning(u.studentId)}>➖ 경고 취소 </button>
                  {u.isBanned && (
                    <button onClick={() => removeUser(u.studentId)}>❌ 탈퇴</button>
                  )}
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