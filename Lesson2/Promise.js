const fsPromises = require("fs").promises;
const path = require("path");

const fileOps = async () => {
	try {
		const data = await fsPromises.readFile(path.join(__dirname, "files", "starter.txt"), "utf8");
		await fsPromises.unlink(path.join(__dirname, "files", "starter.txt"));
		await fsPromises.writeFile(path.join(__dirname, "files", "newDir.txt"), data);
		await fsPromises.appendFile(path.join(__dirname, "files", "newDir.txt"), "\n\nHello Nice to meet you");
		await fsPromises.rename(path.join(__dirname, "files", "newDir.txt"), path.join(__dirname, "files", "Introduction.txt"));
		const newData = await fsPromises.readFile(path.join(__dirname, "files", "Introduction.txt"), "utf8");
		console.log(newData);
	} catch (err) {
		throw new Error(err);
	}
};

fileOps();
