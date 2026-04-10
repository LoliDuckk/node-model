const jwt = require("jsonwebtoken");
const ApiError = require("../error/ApiError");
const { User } = require("../models/models");

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Пользователь не авторизован" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Пользователь не авторизован" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return User.findByPk(decoded.id)
      .then((user) => {
        if (!user) {
          return next(ApiError.forbidden("Пользователь не авторизован"));
        }
        if (user.status === "BLOCKED") {
          return next(ApiError.forbidden("Пользователь заблокирован"));
        }
        req.user = decoded;
        return next();
      })
      .catch((err) => next(err));
  } catch (e) {
    res.status(401).json({ message: "Пользователь не авторизован" });
  }
};
