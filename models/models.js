const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  full_name: { type: DataTypes.STRING, allowNull: false },
  birthday: { type: DataTypes.DATEONLY, allowNull: false },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [5, 255] },
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "USER",
    validate: { isIn: [["ADMIN", "USER"]] },
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "ACTIVE",
    validate: { isIn: [["ACTIVE", "BLOCKED"]] },
  },
});

module.exports = {
  User,
};
