class Reservation {
    constructor(reservationId, spaceId, startTime, endTime) {
      this.reservationId = reservationId;
      this.spaceId = spaceId;
      this.startTime = startTime;
      this.endTime = endTime;
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
  