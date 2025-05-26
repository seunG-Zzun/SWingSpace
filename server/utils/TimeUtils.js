const TimeUtils = {
    
    toTimeString(decimalTime) {
      const hour = Math.floor(decimalTime);
      const minute = Math.round((decimalTime % 1) * 60);
      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    },

    fromTimeString(timeStr) {
      const [hour, minute] = timeStr.split(':').map(Number);
      return hour + minute / 60;
    },
  
    getNowDecimal() {
      const now = new Date();
      return now.getHours() + now.getMinutes() / 60;
    },

    formatFullTime(date, startTime, endTime) {
      const start = this.toTimeString(startTime);
      const end = this.toTimeString(endTime);
      return `${date} ${start} ~ ${end}`;
    }
    
  };
  
  
  module.exports = TimeUtils;
  