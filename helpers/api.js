function sendResponse(data = [], message = "", status = 200) {
  return { status: status, message: message, data: data };
}

function sendError(message = "", status = 404) {
  return { status: status, message: message };
}

module.exports = {
  sendResponse,
  sendError,
};
