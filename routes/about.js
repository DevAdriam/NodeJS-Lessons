const express = require("express");
const router = express.Router();
const path = require("path");

router.get("^/$|index(.html)?", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "views", "about", "index.html"));
});

router.get("/myself(.html)?", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "views", "about", "myself.html"));
});

module.exports = router;
