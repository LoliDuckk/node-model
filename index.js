require("dotenv").config();
const express = require("express");
const cors = require("cors");

const sequelize = require("./db");
const models = require("./models/models");
const router = require("./routes/index");
const errorHandler = require("./middleware/errorHandlingMiddleware");
const { seedAdmin } = require("./utils/seedAdmin");

const PORT = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use(errorHandler);

// Запуск Сервера
const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await seedAdmin();
    app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
