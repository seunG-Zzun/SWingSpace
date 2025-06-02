import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Mypage.css';

function MyPage() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);

  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  const user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;

  // 로그인 여부 확인
 useEffect(() => {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  const user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;

  if (!user || !token) {
    alert('로그인 후 이용 가능합니다.');
    navigate('/login');
  } else {
    loadReservations(token);
  }
  }, []);
  
  // 예약 정보 불러오기
  const loadReservations = async () => {
    try {
      const res = await axios.get(`/reservation/my?includeCancelled=true`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(res.data.data);
    } catch (err) {
      console.error(err);
      alert('예약 정보를 불러오는 데 실패했습니다.');
    }
  };

  const cancelReservation = async (reservationId) => {
    try {
      const res = await axios.delete(`/reservation/cancel/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
      loadReservations();
    } catch (err) {
      const msg = err.response?.data?.message || '알 수 없는 오류';
      alert(`예약 취소 실패: ${msg}`);
    }
  };

  const extendReservation = async (reservationId) => {
    try {
      const res = await axios.put(`/reservation/extend/${reservationId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
      loadReservations();
    } catch (err) {
      const msg = err.response?.data?.message || '알 수 없는 오류';
      alert(`예약 연장 실패: ${msg}`);
    }
  };

  const returnReservation = async (reservationId) => {
    try {
      const res = await axios.put(`/reservation/return/${reservationId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
      loadReservations();
    } catch (err) {
      const msg = err.response?.data?.message || '알 수 없는 오류';
      alert(`예약 반납 실패: ${msg}`);
    }
  };

  const reservationClick = () => {
    navigate('/reservation');
  };

  return (
    <>
      <button className="reservation-button" onClick={reservationClick}>
        예약페이지로 이동
      </button>

      <div className="mypage-wrapper">
        <div className="my-info">
          <h2>나의 예약 목록</h2>
          <div className="my-warning"> 나의 경고 횟수:
             <span className="warning-count">{user?.warningCount ?? 0}회</span>
             <h6 className="warning-text">경고 4회: 정지 및 탈퇴 처리, 재가입 불가 <br/>
                                          사용 종료시간 10분 이내 미반납: 경고 1회 <br/>
                                          타 이용자의 신고 및 제보: 경고 1회</h6>
              </div>
           </div>
        {reservations.length === 0 ? (
          <p>예약 내역이 없습니다.</p>
        ) : (
          <div className="reservation-list">
            {reservations.map((r, i) => (
              <div key={i} className="reservation-card">
                {r.status === 'reserved' && (
                  <button
                    className="action-button return-button top-right"
                    onClick={() => returnReservation(r.reservationId)}
                  >
                    반납
                  </button>
                )}
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
                {r.status === 'returned' && (
                  <p className="returned-text">✔️ 반납됨</p>
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
