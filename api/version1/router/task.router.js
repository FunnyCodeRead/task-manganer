const express = require("express");
const router = express.Router();

const conttoller = require("../controller/task.controller");
router.get("/", conttoller.index);
router.get("/detail/:id", conttoller.details);
router.patch("/change-status/:id", conttoller.changeStatus);
router.patch("/change-mutil", conttoller.changeMutil);

router.post("/create", conttoller.create);
router.patch("/edit/:id", conttoller.edit);
router.delete("/delete/:id", conttoller.delete);
module.exports = router;
