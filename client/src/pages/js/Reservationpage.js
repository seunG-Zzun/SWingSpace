import React, { useState } from 'react';
import axios from 'axios';
import '../css/Reservationpage.css';
import { useNavigate} from 'react-router-dom';
import userIcon from '../../assets/user-icon.png';
import homeIcon from '../../assets/home-icon.png';
import { useEffect } from 'react'; 

function Reservationpage() {
  const navigate = useNavigate();
  
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const tableList = [1, 2, 3, 4];
  const [reservationsByDate, setReservationsByDate] = useState([]);
  const todayStr = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await axios.get(`/reservation/by-date?date=${date}`);
        if (res.data.success) {
          setReservationsByDate(res.data.data);
        }
      } catch (err) {
        console.error('예약 데이터 불러오기 실패:', err);
      }
    };

    if (date) {
      fetchReservations();  // ✅ useEffect 내부에서 정의한 함수 사용
    }
  }, [date]);

  const handleDateChange = (e) => {
    setDate(e.target.value);
    setSelectedTable(null);
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
    setEndTime(''); // 시작 시간이 바뀌면 종료 시간 초기화
  };

  const handleTableClick = (tableId) => {
    setSelectedTable(tableId);
  };

  const handleSeatClick = async (seatIndex) => {
    if (!date || !startTime || !endTime || !selectedTable) {
      alert('날짜, 시간, 테이블을 모두 선택해주세요.');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.studentId || !user.club) {
      alert('로그인이 되어 있어야 하며, 학번과 동아리 정보가 필요합니다.');
      return;
    }

    const reservationData = {
      studentId: user.studentId,
      spaceId: selectedTable,      
      startTime: Number(startTime),
      endTime: Number(endTime),
      club: user.club,              
      seatIndex: seatIndex,         
      date: date                   
    };
    try {
      const res = await axios.post('/reservation/create', reservationData);
      if (res.data.success) {
        alert('✅ 예약이 완료되었습니다!');
      } else {
        alert(`❌ 예약 실패: ${res.data.message}`);
      }
    } catch (error) {
      const message = error.response?.data?.message || '서버 오류가 발생했습니다.';
      alert(`🚫 예약 실패: ${message}`);
    }
  };
  const myPageClick = () => {
    const user = localStorage.getItem('user');
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    } else {
      navigate('/mypage');
    }
  };

  const goHome = () => {
      navigate('/');
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
    <button className="mypage-button" onClick={myPageClick}>
        <img src= { userIcon } alt="사용자 아이콘" className="icon-img" />마이페이지</button>
    <button className="home-button" onClick={goHome}>
        <img src= { homeIcon } alt="사용자 아이콘" className="icon-img" />첫 화면으로</button>

    <div className="reservation-wrapper">
      <h2>예약 날짜 선택</h2>
      <input
        type="date"
        min={todayStr}
        value={date}
        onChange={handleDateChange}
      />
      
      <div className="time-select">
        <select onChange={handleStartTimeChange} value={startTime}>
          <option value="" disabled>시작 시간</option>
          {[...Array(14)].map((_, i) => {
            const time = 9 + i;
            return <option key={time} value={time}>{time}:00</option>;
          })}
        </select>

        <select onChange={(e) => setEndTime(e.target.value)} value={endTime}>
          <option value="" disabled>종료 시간</option>
          {[...Array(14)].map((_, i) => {
            const time = 10 + i;
            const isDisabled = startTime !== '' && time <= parseInt(startTime) && time > parseInt(startTime) + 6; // 6시간 이상 예약 불가
            return (
              <option key={time} value={time} disabled={isDisabled}>
                {time}:00
              </option>
            );
          })}
        </select>
      </div>

      {date && startTime && endTime && (
        <>
          <h3>테이블 선택</h3>
          <div className="table-grid">
            {tableList.map((tableId) => (
              <div
                key={tableId}
                className="table-card"
                onClick={() => handleTableClick(tableId)}
              >
                {getTableStatus(tableId)}
              </div>
            ))}
          </div>

          {selectedTable && (
            <div className="seat-section">
              <h4>{selectedTable}번 테이블 좌석</h4>
              <div className="seat-grid">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="seat-box"
                    onClick={() => handleSeatClick(i)}
                  >
                    {i + 1}번
                  </div>
                ))}
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
