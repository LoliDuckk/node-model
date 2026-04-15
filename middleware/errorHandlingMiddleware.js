const ApiError = require("../error/ApiError");
const logger = require("../utils/logger");

module.exports = function (err, req, res, next) {
  logger.error("Ошибка обработки запроса:", {
    error: err.message,
    stack: err.stack,
    url: req?.url,
    method: req?.method,
    ip: req?.ip,
    userAgent: req?.get ? req.get('User-Agent') : req?.headers?.['user-agent']
  });

  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({
    message: err?.message || "Непредвиденная ошибка!",
  });
};
