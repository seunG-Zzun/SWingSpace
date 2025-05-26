import React, { useState } from 'react';
import axios from 'axios';
import '../css/Reservationpage.css';
import { useNavigate} from 'react-router-dom';
import userIcon from '../../assets/user-icon.png';
function Reservationpage() {
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const tableList = [1, 2, 3, 4];

  const todayStr = new Date().toISOString().slice(0, 10);


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
    console.log('좌석 클릭됨:', seatIndex);  // 확인용 로그
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
      studentId: user.studentId,     // e.g., '20221234'
      spaceId: selectedTable,        // table 번호
      startTime: Number(startTime),
      endTime: Number(endTime),
      club: user.club,               // e.g., '배달의민족'
      seatIndex: seatIndex,          // 0부터 시작
      date: date                     // 'YYYY-MM-DD'
    };

    try {
      const res = await axios.post('/users/reservations', reservationData);
      if (res.data.success) {
        alert('예약이 완료되었습니다!');
      } else {
        alert(`예약 실패: ${res.data.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('서버 오류로 인해 예약에 실패했습니다.');
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
  
  return (
    <>
    <button className="mypage-button" onClick={myPageClick}>
        <img src= { userIcon } alt="사용자 아이콘" className="icon-img" />마이페이지</button>
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
            const isDisabled = startTime !== '' && time <= parseInt(startTime);
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
                테이블 {tableId}
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
