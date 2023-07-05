const express = require("express");
const router = express.Router();
const registration = require("../controllers/registerController");
router.post("/", registration.handleNewUser);

module.exports = router;
