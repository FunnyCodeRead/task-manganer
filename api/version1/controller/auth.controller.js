const { generateRandomNumber } = require("../../../helpers/generate");
const User = require("../../../model/user.model");
const forgotPassword = require("../../../model/forgotPassword.model");
const sendmeailHelper = require("../../../helpers/sendEmail");
const Forgot = require("../../../model/forgotPassword.model");
const { hashPassword, comparePassword } = require("../../../helpers/password");
const { generateToken, verifyToken } = require("../../../helpers/jwt");
// [POST] api/task/register
module.exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const exitsEmail = await User.findOne({ email });

    if (exitsEmail) {
      return res.json({
        code: 400,
        message: "Email đã tồn tại !",
      });
    }
    const newPassword = await hashPassword(password);
    const user = new User({ fullName, email, password: newPassword });
    user.save();
    const token = generateToken(user._id);
    res.cookie("token", token, { httpOnly: true });
    res.json({
      code: 200,
      message: "Đăng ký thành công",

      user: {
        fullName: user.fullName,
        email: user.email,
        token: token,
      },
    });
  } catch (error) {
    res.json({ error: error.message });
  }

  // res.json(user);
};
// [POST] api/task/login

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        code: 400,
        message: "Email khong dung",
      });
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.json({
        code: 400,
        message: "Mat khau khong dung",
      });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, { httpOnly: true });
    res.json({
      code: 200,
      message: "Dang nhap thanh cong",
      token: token,
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Loi server",
      err: error.message,
    });
  }
};
// [POST] api/task/forgot-password/
module.exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    console.log(email);
    const exitsEmail = await User.findOne({
      email: email,
      deleted: false,
    });
    if (!exitsEmail) {
      res.json({
        code: 400,
        message: "Email khong ton tai",
      });
      return;
    }

    const otp = generateRandomNumber(4);
    // Lưu data vào databse
    const timeExpire = 3;
    const ObjectForgotPassword = {
      email: email,
      otp: otp,
      expireAt: new Date(Date.now() + timeExpire * 60 * 1000),
    };
    const forgotpass = new Forgot(ObjectForgotPassword);
    await forgotpass.save();

    // Send Email
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `Mã OTP để lấy lại mật khẩu là <b>${otp} </b> sử dụng trong ${timeExpire} phút\n
    Vui lòng không chia sẻ mã cho bất cứ ai`;

    sendmeailHelper.sendEmail(email, subject, html);
    res.json({
      code: 200,
      message: "Đã gửi mã OTP qua email",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "That bai",
      err: error,
    });
  }
};
// [POST] api/task/forgot-password/otp
module.exports.otpPassword = async (req, res) => {
  const otp = req.body.otp;
  const email = req.body.email;
  const resutl = await forgotPassword.findOne({
    email: email,
    otp: otp,
  });

  if (!resutl) {
    return res.json({
      code: 400,
      message: "OTP khong hợp lệ",
    });
  }
  const user = await User.findOne({
    email: email,
  });
  const token = generateToken(user._id);

  res.cookie("resetToken", token, { httpOnly: true });
  res.json({
    code: 200,
    message: "Xác nhận thành công",
  });
};
// [POST] api/task/forgot-password/resetPassword
module.exports.resetPassword = async (req, res) => {
  try {
    const token = req.body.token;
    const newPassword = req.body.password;
    const resetToken = req.cookies.resetToken;

    if (!resetToken) {
      return res.json({
        code: 400,
        message: "Bạn chưa xác thực OTP",
      });
    }
    const decoded = verifyToken(resetToken);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.json({ code: 400, message: "User không tồn tại" });
    }
    // Nếu muốn kiểm tra mật khẩu mới có trùng mật khẩu cũ không
    const isSame = await comparePassword(newPassword, user.password);
    if (isSame) {
      return res.json({
        code: 400,
        message: "Mật khẩu mới không được trùng mật khẩu cũ",
      });
    }

    // Hash mật khẩu mới
    const hashed = await hashPassword(newPassword);

    user.password = hashed;

    await user.save();

    return res.json({
      code: 200,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    return res.json({
      code: 500,
      message: "Lỗi server",
      error,
    });
  }
};
// [POST] api/task/details
module.exports.details = (req, res) => {
  res.json({
    code: 200,
    message: "Thông tin user",
    info: req.user,
  });
};

// [POST] api/task/list
module.exports.list = async (req, res) => {
  const listUser = await User.find({
    deleted: false,
  }).select("fullName email");
  res.json({
    code: 200,
    message: "Thông tin user",
    info: listUser,
  });
};
