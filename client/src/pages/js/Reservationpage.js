import React, { useState } from 'react';
import axios from 'axios';
import '../css/Reservationpage.css'
function Reservationpage() {
  const [selectedTable, setSelectedTable] = useState(null);
  const tableList = [1, 2, 3, 4]; 
  const handleTableClick = (tableId) => {
    setSelectedTable(tableId);
    // 👇 이후 해당 테이블 예약 정보 불러오기 (useEffect 등)
  };

  const handleSeatClick = (seatIndex) => {
    alert(`${selectedTable}번 테이블 ${seatIndex + 1}번 좌석 예약`);
    // 👇 예약 API 호출 가능
  };

  return (
    <div className="reservation-wrapper">
      <div className="table-grid">
        {tableList.map((tableId) => (
          <div
            key={tableId}
            className="table-card"
            onClick={() => handleTableClick(tableId)}
          >
            테이블{tableId}
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
    </div>
  );
}

export default Reservationpage;
