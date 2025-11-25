const express = require("express");

const router = express.Router();
const controller = require("../controller/auth.controller");
const { checkLogin } = require("../../../middlewares/auth");
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/password/forgot-password", controller.forgotPassword);
router.post("/password/otp", controller.otpPassword);
router.post("/password/reset", controller.resetPassword);
router.get("/details", checkLogin, controller.details);
router.get("/list", checkLogin, controller.list);
module.exports = router;
