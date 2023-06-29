const logEvents = require("./logEvents");
const EventEmitter = require("events");
const http = require("http");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on("log", (message, filename) => logEvents(message, filename));
const PORT = process.env.port || 3000;

const serveFile = async (filepath, contentType, response) => {
	try {
		const rawData = await fsPromises.readFile(filepath, contentType.includes("image") ? "" : "utf8");
		const data = contentType === "application/json" ? JSON.parse(rawData) : rawData;
		response.writeHead(filepath.includes("404.html") ? 404 : 200, { "Content-Type": contentType });
		response.end(contentType === "application/json" ? JSON.stringify(data) : data);
	} catch (err) {
		console.log(err);
		myEmitter.emit("log", `${err.name}:${err.message}`, "error.txt");
		response.statusCode = 500;
		response.end();
	}
};

const server = http.createServer((req, res) => {
	console.log(req.url, req.method);
	myEmitter.emit("log", `${req.url}\t${req.method}`, "reqLog.txt");

	//Setting the Content type
	const extension = path.extname(req.url);
	let contentType;

	switch (extension) {
		case ".css":
			contentType = "text/css";
			break;
		case ".js":
			contentType = "text/javascript";
			break;
		case ".json":
			contentType = "application/json";
			break;
		case ".jpg":
			contentType = "image/jpeg";
			break;
		case ".png":
			contentType = "image/png";
			break;
		case ".txt":
			contentType = "text/plain";
			break;
		default:
			contentType = "text/html";
	}

	let filepath;

	if (contentType === "text/html" && req.url === "/") {
		filepath = path.join(__dirname, "views", "index.html");
	} else if (contentType === "text/html" && req.url.slice(-1) === "/") {
		filepath = path.join(__dirname, "views", req.url, "index.html");
	} else if (contentType === "text/html") {
		filepath = path.join(__dirname, "views", req.url);
	} else {
		filepath = path.join(__dirname, req.url);
	}

	// adding about or contact without .html (about.html) juz only about
	if (!extension && req.url.slice(-1) !== "/") filepath += ".html";

	const fileExists = fs.existsSync(filepath);

	if (fileExists) {
		serveFile(filepath, contentType, res);
	} else {
		// 404 Not Found
		// 301 Redirected
		// console.log(path.parse(filepath));

		//redirecting routes
		switch (path.parse(filepath).base) {
			case "old-page.html":
				res.writeHead(301, { Location: "/new-page.html" });
				res.end();
				break;

			case "www-page.html":
				res.writeHead(301, { Location: "/" });
				res.end();
				break;

			default:
				serveFile(path.join(__dirname, "views", "404.html"), "text/html", res);
		}
	}
});

server.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`);
});

// let filepath;
// if (req.url === "/" || req.url === "index.html") {
// 	res.statusCode = 200;
// 	res.setHeader = ("Content-Type", "text/html");
// 	filepath = path.join(__dirname, "views", "index.html");
// 	fs.readFile(filepath, "utf8", (err, data) => {
// 		if (err) throw err;
// 		res.end(data); // sending data to index.html
// 	});
// }
