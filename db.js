const { Sequelize } = require("sequelize");
require("dotenv").config();

module.exports = new Sequelize(
  process.env.DB_NAME, // Имя БД
  process.env.DB_USER, // Пользователь БД
  process.env.DB_PASSWORD, // Пароль БД
  {
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: false,
  },
);
