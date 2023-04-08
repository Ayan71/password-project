const express = require("express");

const router = express.Router();

const homeContoller = require("../controller/header_controllers");
// router.get('/front', homeContoller.home)

//router header
router.get("/header", homeContoller.header);

router.use("/users", require("./users"));

module.exports = router;
