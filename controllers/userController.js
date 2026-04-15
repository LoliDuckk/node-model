const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/models");

const generateJwt = (id, full_name, birthday, email, role, status) => {
  return jwt.sign(
    { id, full_name, birthday, email, role, status },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "24h",
    },
  );
};

async function setBlockedStatus(userId, blocked, next) {
  const user = await User.findByPk(userId, {
    attributes: {
      exclude: ["password"],
    },
  });

  if (!user) {
    return next(ApiError.notFound("Пользователь не найден"));
  }

  const newStatus = blocked ? "BLOCKED" : "ACTIVE";
  if (user.status === newStatus) {
    return user;
  }

  user.status = newStatus;
  await user.save();
  return user;
}

class UserController {
  async registration(req, res, next) {
    try {
      const { full_name, birthday, email, password } = req.body;

      if (!full_name || !birthday || !email || !password) {
        return next(ApiError.badRequest("Некорректные данные для регистрации"));
      }

      const fioParts = String(full_name).trim().split(/\s+/).filter(Boolean);
      if (fioParts.length !== 3) {
        return next(ApiError.badRequest("ФИО должно состоять ровно из 3 слов"));
      }

      // Валидация пароля
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        return next(ApiError.badRequest("Пароль должен содержать минимум 8 символов, буквы верхнего и нижнего регистра, цифры"));
      }

      const candidateEmail = await User.findOne({ where: { email } });
      if (candidateEmail) {
        return next(
          ApiError.badRequest("Пользователь с таким email уже существует"),
        );
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        full_name: fioParts.join(" "),
        birthday,
        email,
        password: hashPassword,
      });

      const token = generateJwt(
        user.id,
        user.full_name,
        user.birthday,
        user.email,
        user.role,
        user.status,
      );
      return res.json({ token });
    } catch (err) {
      return next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return next(ApiError.badRequest("Пользователь не найден"));
      }

      if (user.status === "BLOCKED") {
        return next(ApiError.forbidden("Пользователь заблокирован"));
      }

      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        return next(ApiError.badRequest("Указан неверный пароль"));
      }

      const token = generateJwt(
        user.id,
        user.full_name,
        user.birthday,
        user.email,
        user.role,
        user.status,
      );
      return res.json({ token });
    } catch (err) {
      return next(err);
    }
  }

  async getMe(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(ApiError.forbidden("Пользователь не авторизован"));
      }

      const user = await User.findByPk(userId, {
        attributes: {
          exclude: ["password"],
        },
      });

      if (!user) {
        return next(ApiError.notFound("Пользователь не найден"));
      }

      return res.json(user);
    } catch (err) {
      return next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = Number.parseInt(id, 10);
      if (!Number.isFinite(userId)) {
        return next(ApiError.badRequest("Некорректный id пользователя"));
      }

      const user = await User.findByPk(userId, {
        attributes: {
          exclude: ["password"],
        },
      });

      if (!user) {
        return next(ApiError.notFound("Пользователь не найден"));
      }

      return res.json(user);
    } catch (err) {
      return next(err);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows } = await User.findAndCountAll({
        attributes: [
          "id",
          "full_name",
          "birthday",
          "email",
          "role",
          "status",
          "createdAt",
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']],
      });

      return res.json({
        users: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      });
    } catch (err) {
      return next(err);
    }
  }

  async blockById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = Number.parseInt(id, 10);
      if (!Number.isFinite(userId)) {
        return next(ApiError.badRequest("Некорректный id пользователя"));
      }

      if (userId === req.user?.id) {
        return next(
          ApiError.badRequest("Невозможно заблокировать самого себя"),
        );
      }

      let blocked = true;
      if (req.body?.blocked !== undefined) {
        if (typeof req.body.blocked !== "boolean") {
          return next(
            ApiError.badRequest('Поле "blocked" должно быть boolean'),
          );
        }
        blocked = req.body.blocked;
      }

      const user = await setBlockedStatus(userId, blocked, next);
      if (!user) return;
      return res.json(user);
    } catch (err) {
      return next(err);
    }
  }

  async blockMe(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(ApiError.forbidden("Пользователь не авторизован"));
      }

      const user = await setBlockedStatus(userId, true, next);
      if (!user) return;
      return res.json(user);
    } catch (err) {
      return next(err);
    }
  }

  async check(req, res, next) {
    try {
      const token = generateJwt(
        req.user.id,
        req.user.full_name,
        req.user.birthday,
        req.user.email,
        req.user.role,
        req.user.status,
      );
      return res.json({ token });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new UserController();
