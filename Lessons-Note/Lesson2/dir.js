const fs = require("fs");

if (!fs.existsSync("./new")) {
	fs.mkdir("./new", (err) => {
		if (err) throw err;
		console.log("new dir created");
	});
}

if (fs.existsSync("./new")) {
	fs.rmdir("./new", (err) => {
		if (err) throw err;
		console.log("deleted new dir");
	});
}
// The existsSync() function operates synchronously,
// meaning it blocks the execution of the code until it
// completes the file system operation. This synchronous behavior
//  can be useful in certain scenarios where you need to immediately
//   determine the existence of a file or directory before proceeding with other tasks.
