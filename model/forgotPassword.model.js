const database = require("mongoose");

const forgotPasswordSchema = new database.Schema(
  {
    email: String,
    otp: String,
    expireAt: {
      type: Date,
      expires: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Forgot = database.model(
  "forgotPassword",
  forgotPasswordSchema,
  "forgot-password"
);
module.exports = Forgot;
