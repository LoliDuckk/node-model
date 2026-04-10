const bcrypt = require("bcrypt");
const { User } = require("../models/models");

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return;
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    return;
  }

  const fullName = process.env.ADMIN_FULL_NAME || "Admin Admin Admin";
  const birthday = process.env.ADMIN_BIRTHDAY || "1970-01-01";
  const hashPassword = await bcrypt.hash(password, 5);

  await User.create({
    full_name: fullName,
    birthday,
    email,
    password: hashPassword,
    role: "ADMIN",
    status: "ACTIVE",
  });
}

module.exports = { seedAdmin };

