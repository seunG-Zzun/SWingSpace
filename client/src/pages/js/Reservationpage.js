import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Reservationpage.css';
import { useNavigate } from 'react-router-dom';
import userIcon from '../../assets/user-icon.png';
import homeIcon from '../../assets/home-icon.png';

function Reservationpage() {
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const tableList = [1, 2, 3, 4];
  const [reservationsByDate, setReservationsByDate] = useState([]);

  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  const user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;

  // 로그인 안 된 사용자 차단
  useEffect(() => {
    if (!user || !token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [user, token, navigate]);

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const loadReservationsByDate = async () => {
    try {
      const res = await axios.get(`/reservation/date?date=${date}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setReservationsByDate(res.data.data);
      }
    } catch (err) {
      console.error('예약 데이터 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    if (date) {
      loadReservationsByDate();
    }
  }, [date]);

  const handleDateChange = (e) => {
    setDate(e.target.value);
    setSelectedTable(null);
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
    setEndTime('');
  };

  const handleTableClick = (tableId) => {
    setSelectedTable(tableId);
  };

  const handleSeatClick = async (seatIndex) => {
    if (!date || !startTime || !endTime || !selectedTable) {
      alert('날짜, 시간, 테이블을 모두 선택해주세요.');
      return;
    }

    if (!user || !user.club) {
      alert('로그인이 되어 있어야 하며, 동아리 정보가 필요합니다.');
      return;
    }

    const reservationData = {
      spaceId: selectedTable,
      startTime: Number(startTime),
      endTime: Number(endTime),
      club: user.club,
      seatIndex,
      date
    };

    try {
      const res = await axios.post('/reservation', reservationData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        alert('✅ 예약이 완료되었습니다!');
        await loadReservationsByDate();
      } else {
        alert(`❌ 예약 실패: ${res.data.message}`);
      }
    } catch (error) {
      const message = error.response?.data?.message || '서버 오류가 발생했습니다.';
      alert(`🚫 예약 실패: ${message}`);
    }
  };

  const myPageClick = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    } else {
      navigate('/mypage');
    }
  };


  const getTableStatus = (tableId) => {
    if (!startTime || !endTime) return `테이블 ${tableId}`;
    const overlapping = reservationsByDate.filter(r =>
      r.spaceId === tableId &&
      r.status === 'reserved' &&
      Number(startTime) < r.endTime &&
      Number(endTime) > r.startTime
    );
    if (overlapping.length > 0) {
      return `${tableId}번 - ${overlapping[0].club} 동아리 사용 중`;
    }
    return `테이블 ${tableId}`;
  };

  return (
    <>
      <div className="login-groups">
        <button className="mypage-button" onClick={myPageClick}>
          <img src={userIcon} alt="사용자 아이콘" className="icon-img" /> MyPage
        </button>
        <button className="home-button" onClick={() => navigate('/')}>
          <img src={homeIcon} alt="홈 아이콘" className="icon-img" /> Home
        </button>

        {user?.role === 'admin' && (
          <div className="top-right-buttons">
            <button className="admin-button" onClick={() => navigate('/admin')}>
              🛠 관리자 메뉴
            </button>
          </div>
        )}    
      </div>

      <div className="reservation-wrapper">
        <h2>예약 날짜 선택</h2>
        <input type="date" min={todayStr} value={date} onChange={handleDateChange} />

        <div className="time-select">
          <select onChange={handleStartTimeChange} value={startTime}>
            <option value="" disabled>시작 시간</option>
            {[...Array(14)].map((_, i) => {
              const time = 9 + i;
              const currentHour = new Date().getHours();
              const isToday = date === todayStr;
              const isDisabled = isToday && time < currentHour;
              return <option key={time} value={time} disabled={isDisabled}>{time}:00</option>;
            })}
          </select>

          <select onChange={(e) => setEndTime(e.target.value)} value={endTime}>
            <option value="" disabled>종료 시간</option>
            {[...Array(14)].map((_, i) => {
              const time = 10 + i;
              const isDisabled = startTime !== '' && (time <= parseInt(startTime) || time > parseInt(startTime) + 6);
              return <option key={time} value={time} disabled={isDisabled}>{time}:00</option>;
            })}
          </select>
        </div>

        {date && startTime && endTime && (
          <>
            <h3>테이블 선택</h3>
            <div className="table-grid">
              {tableList.map((tableId) => (
                <div key={tableId} className="table-card" onClick={() => handleTableClick(tableId)}>
                  {getTableStatus(tableId)}
                </div>
              ))}
            </div>

            {selectedTable && (
              <div className="seat-section">
                <h4>{selectedTable}번 테이블 좌석</h4>
                <div className="seat-grid">
                  {[...Array(6)].map((_, i) => {
                    const isReserved = reservationsByDate.some(r =>
                      r.spaceId === selectedTable &&
                      r.seatIndex === i &&
                      r.status === 'reserved' &&
                      Number(startTime) < r.endTime &&
                      Number(endTime) > r.startTime
                    );
                    return (
                      <div
                        key={i}
                        className={`seat-box ${isReserved ? 'reserved' : ''}`}
                        onClick={() => !isReserved && handleSeatClick(i)}
                      >
                        {i + 1}번
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Reservationpage;
