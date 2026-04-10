const ApiError = require("../error/ApiError");

module.exports = function (err, req, res, next) {
  // Логируем первопричину, чтобы не гадать по "Непредвиденная ошибка!"
  // eslint-disable-next-line no-console
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({
    message: err?.message || "Непредвиденная ошибка!",
  });
};
