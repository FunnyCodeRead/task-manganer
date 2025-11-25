const taskRouter = require("./task.router");
const userRouter = require("./user.router");
const { checkLogin } = require("../../../middlewares/auth");
module.exports = (app) => {
  const version = "/api/version1";

  app.use(version + "/task", checkLogin, taskRouter);
  app.use(version + "/users", userRouter);
};
