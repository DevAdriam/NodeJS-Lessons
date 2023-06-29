const express = require("express");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 3000;

app.get("^/$|/index(.html)?", (req, res) => {
	// res.sendFile("/views/index.html", { root: __dirname });
	res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, res) => {
	res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.html)?", (req, res) => {
	res.redirect(301, "/new-page.html"); // 302 by default
	// 302 Move temporaily & 301 Moved permanently
});

// Route Handlers
app.get(
	"/hello(.html)?",
	(req, res, next) => {
		console.log("attempted to load hello.html");
		next();
	},
	(req, res) => {
		res.send("HELLO WORLD!");
	}
);

// chaining route handlers
const one = (req, res, next) => {
	console.log("one");
	next();
};
const two = (req, res, next) => {
	console.log("two");
	next();
};
const three = (req, res) => {
	console.log("three");
	res.send("Finished");
};

app.get("/chain(.html)?", [one, two, three]);

// Default
app.get("/*", (req, res) => {
	res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));