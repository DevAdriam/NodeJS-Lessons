const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;

const logEvents = async (message, filename) => {
	const date = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
	const logItems = `${date}\t${uuid()}\t${message}\n`;

	try {
		if (!fs.existsSync(path.join(__dirname, "logs"))) {
			await fsPromises.mkdir("logs");
		}
		await fsPromises.appendFile(path.join(__dirname, "logs", filename), logItems);
	} catch (err) {
		console.err(err);
	}
};

module.exports = logEvents;
