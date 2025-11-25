const User = require("../model/user.model");
const jwt = require("jsonwebtoken");

module.exports.checkLogin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập" });
    }

    // Giải mã token

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.id,
      deleted: false,
    }).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token hết hạn hoặc sai" });
  }
};
