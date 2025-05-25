class Space {
    constructor(spaceNumber) {
      this.spaceNumber = spaceNumber;    
      this.capacity = 6;                 
      this.reservations = [];           
    }
  
    getReservationCount() {
      return this.reservations.length;
    }
  
    canReserve(_studentId, club) {
      if (this.reservations.length >= this.capacity) {
        return false;
      }
  
      if (this.reservations.length === 0) {
        return true;
      }
  
      const currentClub = this.reservations[0].club;
      return club === currentClub;
    }
  
    reserve(studentId, club) {
      if (!this.canReserve(studentId, club)) {
        return { success: false, message: '예약 불가: 정원이 찼거나 동아리가 다름' };
      }
  
      this.reservations.push({ studentId, club });
      return { success: true, message: `예약 성공: ${studentId}` };
    }
  
    getReservations() {
      return this.reservations;
    }
  }
  
  module.exports = Space;
  