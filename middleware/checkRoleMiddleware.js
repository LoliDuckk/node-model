const verifyToken = require("./verifyToken");

module.exports = function (role) {
  return async function (req, res, next) {
    if (req.method === "OPTIONS") {
      return next();
    }

    try {
      const authHeader = req.headers.authorization;
      const { error, decoded } = await verifyToken(authHeader);

      if (error) {
        return res.status(401).json({ message: error });
      }

      const requiredRole = String(role).trim().toLowerCase();
      const userRole = String(decoded.role || "")
        .trim()
        .toLowerCase();

      if (userRole !== requiredRole) {
        return res.status(403).json({ message: "Нет прав доступа" });
      }

      req.user = decoded;
      return next();
    } catch (e) {
      return res.status(401).json({ message: "Пользователь не авторизован" });
    }
  };
};
