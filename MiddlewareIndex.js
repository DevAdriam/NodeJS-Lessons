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
const corsOptions = require("./config/corsOptions");
const PORT = process.env.PORT || 3500;

//Custom Middleware (very top)
app.use(logger);

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

//built-in middleware to handle urlencoded data ,in other words , Form Data:
// "content-type : application/x-www-form-urlencoded"
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//serve static file
app.use("/", express.static(path.join(__dirname, "/public"))); // defautlt '/'
app.use("/subdir", express.static(path.join(__dirname, "/public"))); // for subdir

// route for subdir (Lesson 8 How to setup route with express router)
app.use("/", require("./routes/root"));
app.use("/subdir", require("./routes/subdir"));
app.use("/about", require("./routes/about"));
app.use("/employees", require("./routes/api/employee"));

app.all("*", (req, res) => {
	res.status = 404;
	if (req.accepts("html")) {
		return res.sendFile(path.join(__dirname, "views", "404.html"));
	} else if (req.accepts("application/json")) {
		return res.json({ error: "404 not found!" });
	} else {
		res.type("txt").send("404 not found");
	}
});

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
