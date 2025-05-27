class Reservation {
  constructor(reservationId, studentId, spaceId, startTime, endTime, club, seatIndex, date) { //date추가
    this.studentId = studentId;
    this.reservationId = reservationId;
    this.spaceId = spaceId;
    this.startTime = startTime;
    this.endTime = endTime;
    this.club = club;
    this.seatIndex = seatIndex;
    this.date = date;
    this.isExtended = false;
    this.status = "reserved";
  }
  
    extend() {
      this.endTime += 1.0;
    }
  
    cancel() {
      this.status = "cancelled";
    }
  
    returnReservation() {
      this.status = "returned";
    }
  
    canBeExtended(now, isAvailable) {
      return now >= this.endTime - 0.5 && isAvailable;
    }
  }
  
  module.exports = Reservation;
  