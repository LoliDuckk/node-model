require("dotenv").config();

// Проверка обязательных переменных окружения
if (!process.env.JWT_SECRET_KEY) {
  console.error("Ошибка: JWT_SECRET_KEY не задан в переменных окружения");
  process.exit(1);
}

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const logger = require("./utils/logger");

const sequelize = require("./db");
const router = require("./routes/index");
const errorHandler = require("./middleware/errorHandlingMiddleware");
const { generalLimiter } = require("./middleware/rateLimitMiddleware");
const swaggerSpecs = require("./utils/swaggerOptions");
const { seedAdmin } = require("./utils/seedAdmin");

const PORT = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(generalLimiter);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use("/api", router);

app.use(errorHandler);

// Запуск Сервера
const start = async () => {
  try {
    logger.info("Подключение к базе данных...");
    await sequelize.authenticate();
    logger.info("База данных подключена успешно");

    logger.info("Инициализация администратора...");
    await seedAdmin();
    logger.info("Администратор инициализирован");

    app.listen(PORT, (err) => {
      if (err) {
        logger.error("Ошибка запуска сервера:", err);
        process.exit(1);
      }
      logger.info(`Сервер запущен на порту: ${PORT}`);
      logger.info(
        `Документация API доступна: http://localhost:${PORT}/api/docs`,
      );
    });
  } catch (e) {
    logger.error("Ошибка запуска приложения:", e);
    process.exit(1);
  }
};

start();
