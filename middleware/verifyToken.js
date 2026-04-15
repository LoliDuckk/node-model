const jwt = require("jsonwebtoken");
const ApiError = require("../error/ApiError");
const { User } = require("../models/models");

const verifyToken = async (authHeader) => {
  if (!authHeader) {
    return { error: "Пользователь не авторизован" };
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return { error: "Пользователь не авторизован" };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return { error: "Пользователь не найден" };
    }

    if (user.status === "BLOCKED") {
      return { error: "Пользователь заблокирован" };
    }

    return { decoded };
  } catch (err) {
    return { error: "Пользователь не авторизован", err };
  }
};

module.exports = verifyToken;
