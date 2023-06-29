const fs = require("fs");
const path = require("path");

const rs = fs.createReadStream(path.join(__dirname, "files", "lorem.txt"), { encoding: "utf8" });
const ws = fs.createWriteStream(path.join(__dirname, "files", "new-lorem.txt"));

// rs.on("data", (dataChunk) => {
// 	ws.write(dataChunk);
// });

rs.pipe(ws);
// It connects the output of the readable stream to the input of the writable stream, allowing
// data to flow seamlessly from one stream to another.
