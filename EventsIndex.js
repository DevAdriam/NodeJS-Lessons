const logEvents = require("./logEvents");
const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}

//Initialize object
const myEmitter = new MyEmitter();

//add listener for the log event
myEmitter.on("logs", (msg) => logEvents(msg));

setTimeout(() => {
	myEmitter.emit("logs", "Log events emitted");
}, 2000);
