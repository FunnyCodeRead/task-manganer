const bcrypt = require("bcrypt");

// Hash mật khẩu
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

// So sánh mật khẩu
async function comparePassword(inputPassword, hashedPassword) {
  return bcrypt.compare(inputPassword, hashedPassword);
}

module.exports = {
  hashPassword,
  comparePassword,
};
