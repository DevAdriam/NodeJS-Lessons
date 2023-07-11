const fs = require("fs");
const path = require("path");

fs.readFile(path.join(__dirname, "files", "starter.txt"), "utf-8", (err, data) => {
	if (err) throw new Error("file cannot be opened");

	// console.log(data); // result return with Buffer
	// console.log(data.toString()); instead of this we can use encoding
	console.log(data);
});

fs.writeFile(path.join(__dirname, "files", "reply.txt"), "Nice to meet you", (err) => {
	if (err) throw new Error(`Uncaught error : ${err}`);
	console.log("Write completed");

	fs.appendFile(path.join(__dirname, "files", "reply.txt"), "\n\nYes it is", (err) => {
		if (err) throw new Error(`Uncaught error : ${err}`);
		console.log("Append in write task completed");

		fs.rename(path.join(__dirname, "files", "reply.txt"), path.join(__dirname, "files", "newName.txt"), (err) => {
			if (err) throw new Error(`Uncaught error : ${err}`);
			console.log("Rename completed");
		});
	});
});

fs.appendFile(path.join(__dirname, "files", "test.txt"), "testing text..... almost get it...", (err) => {
	if (err) throw new Error(`Uncaught error : ${err}`);
	console.log("Append Completed");
});

console.log("Hello ....");

// exit on uncaught errors
process.on("uncaughtException", (err) => {
	console.error(`There was an uncaught error : ${err}`);
	process.exit(1);
});
