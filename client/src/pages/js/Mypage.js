import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Mypage.css';

function MyPage() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [studentId, setStudentId] = useState(null); 

  // 1. 로그인 여부 확인
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('로그인 후 이용 가능합니다.');
      navigate('/login');
    } else {
      setStudentId(user.studentId);
      loadReservations(user.studentId);
    }
  }, []);

  // 2. 예약 정보 불러오기
  const loadReservations = async (studentId) => {
    try {
      const res = await axios.get(`/reservation/my?studentId=${studentId}&includeCancelled=true`);
      setReservations(res.data.data); 
    } catch (err) {
      console.error(err);
      alert('예약 정보를 불러오는 데 실패했습니다.');
    }
  };

  const cancelReservation = async (reservationId) => {
    let msg = '';
    try {
      const res = await axios.post('/reservation/cancel', { reservationId });
      msg = res.data.message;
      alert(res.data.message);
      loadReservations(studentId);
    } catch (err) {
      const msg = err.response?.data?.message || '알 수 없는 오류';
      alert(`예약 취소 실패: ${msg}`);
      
    }
  };

  const extendReservation = async (reservationId) => {
    let msg = '';
    try {
      const res = await axios.post('/reservation/extend', { reservationId });
      msg = res.data.message;
      alert(res.data.message);
      loadReservations(studentId);
    } catch (err) {
      const msg = err.response?.data?.message || '알 수 없는 오류';
      alert(`예약 연장 실패: ${msg}`);
    }
  };
  const reservationClick = () => {navigate('/reservation');};  

  return (
    <>
    <button className="reservation-button" onClick={reservationClick}>예약페이지로 이동</button>
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
                {r.status === 'reserved' && (
                  <div className="action-buttons">
                    <button
                      className="action-button cancel-button"
                      onClick={() => cancelReservation(r.reservationId)}
                    >
                      취소
                    </button>
                    <button
                      className="action-button extend-button"
                      onClick={() => extendReservation(r.reservationId)}
                    >
                      연장
                    </button>
                  </div>
                )}
                {r.status === 'cancelled' && (
                  <p className="cancelled-text">✖️ 취소됨</p>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
    </> 
  );
}
export default MyPage;
