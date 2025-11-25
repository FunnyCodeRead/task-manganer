const jwt = require("jsonwebtoken");

module.exports.generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d", // token sống 1 ngày
  });
};

module.exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
