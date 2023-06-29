const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;

const logEvents = async (message, filename) => {
	const date = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
	const logItems = `${date}\t${uuid()}\t${message}\n`;

	try {
		if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
			await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
		}
		await fsPromises.appendFile(path.join(__dirname, "..", "logs", filename), logItems);
	} catch (err) {
		console.err(err);
	}
};

const logger = (req, res, next) => {
	logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
	console.log(`${req.method}\t${req.path}`);
	next();
};

module.exports = { logger, logEvents };
