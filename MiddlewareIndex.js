//  What is Middleware ?
/* A request handler with access to the application's request-response cycle is known as middleware. 
It's a function that holds the request object, the response object, and the middleware function. 
Middleware can also send the response to the server before the request*/

// Start with built-in Middleware
const express = require("express");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logEvents");
const cors = require("cors");
const PORT = process.env.PORT || 3500;

//Custom Middleware (very top)
app.use(logger);

//Cross Origin Resource Sharing
const whiteList = ["https://www.yoursite.com", "http://127.0.0.1:5500", "http://localhost:3500", "https://www.google.com"];
const corsOptions = {
	origin: (origin, callback) => {
		if (whiteList.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by cors"));
		}
	},
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

//built-in middleware to handle urlencoded data ,in other words , Form Data:
// "content-type : application/x-www-form-urlencoded"
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//server static file
app.use(express.static(path.join(__dirname, "/public")));

app.get("^/$|/index(.html)?", (req, res) => {
	res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, res) => {
	res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.html)?", (req, res) => {
	res.redirect(301, "/new-page.html");
});

app.get(
	"/hello(.html)?",
	(req, res, next) => {
		console.log("attempting to load the hello.html");
		next();
	},
	(req, res) => {
		res.send("Hello World!");
	}
);

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

app.get("/*", (req, res) => {
	res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
