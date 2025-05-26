import React, { useState } from 'react';
import axios from 'axios';
import '../css/Reservationpage.css';

function Reservationpage() {
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

  const handleSeatClick = (seatIndex) => {
    alert(`${selectedTable}번 테이블 ${seatIndex + 1}번 좌석 예약`);
    // axios.post(...) 예약 요청 가능
  };

  return (
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
  );
}

export default Reservationpage;
