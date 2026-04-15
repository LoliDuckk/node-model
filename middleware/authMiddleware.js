const verifyToken = require("./verifyToken");

module.exports = async function (req, res, next) {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const authHeader = req.headers.authorization;
    const { error, decoded } = await verifyToken(authHeader);

    if (error) {
      return res.status(401).json({ message: error });
    }

    req.user = decoded;
    return next();
  } catch (e) {
    return res.status(401).json({ message: "Пользователь не авторизован" });
  }
};
