const express = require("express");
const router = express.Router();
const logoutHandler = require("../controllers/logoutcontroller");

router.post("/", logoutHandler.handleLogout);

module.exports = router;
