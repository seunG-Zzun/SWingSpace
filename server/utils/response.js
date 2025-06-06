exports.success = (data, message = '성공') => ({
  success: true,
  message,
  data,
});

exports.error = (message = '오류', status = 500) => ({
  success: false,
  message,
  status,
});

exports.createResponse = (success, message, data = null) => ({
  success,
  message,
  data
});