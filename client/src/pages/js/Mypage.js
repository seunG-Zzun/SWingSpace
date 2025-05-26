import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Mypage.css';

function MyPage() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);

  // 1. 로그인 여부 확인
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      alert('로그인 후 이용 가능합니다.');
      navigate('/login');
    } else {
      const { studentId } = JSON.parse(user);
      loadReservations(studentId);
    }
  }, []);

  // 2. 예약 정보 불러오기
  const loadReservations = async (studentId) => {
    try {
      const res = await axios.get(`/api/reservations?studentId=${studentId}`);
      setReservations(res.data); // 서버에서 사용자 예약 목록 반환
    } catch (err) {
      console.error(err);
      alert('예약 정보를 불러오는 데 실패했습니다.');
    }
  };

  return (
    <div className="mypage-wrapper">
      <h2>나의 예약 목록</h2>
      {reservations.length === 0 ? (
        <p>예약 내역이 없습니다.</p>
      ) : (
        <div className="reservation-list">
          {reservations.map((r, i) => (
            <div key={i} className="reservation-card">
              <p>📅 {r.date}</p>
              <p>🪑 테이블 {r.spaceId}번 / 좌석 {r.seatIndex + 1}번</p>
              <p>🕒 {r.startTime}:00 ~ {r.endTime}:00</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPage;
