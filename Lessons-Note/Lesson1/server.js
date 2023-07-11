// How Nodejs differs from Vanilla JS
// 1. Node runs on a server - not in browser
// 2. The console is the terminal window
console.log("hello");

// 3. Global object instead of window object
console.log(global); //smaller object than window object

// 4. Has common core modules that we will explore (includes operating system,file systen and the other things)
// 5. To import , We use "Common JS" modules instead of "ES6" modules
// 6. Missing some JS APIS like fetch
const os = require("os");
const path = require("path");

console.log(os.type()); // Windows_NT
console.log(os.homedir()); // C:\Users\Naing Aung Zaw
console.log(os.version()); // Window 10 Pro

console.log(__dirname); //C:\Users\Naing Aung Zaw\Documents\NodeJS-Lessons\Lesson1
console.log(__filename); // server.js

console.log(path.dirname(__filename)); //C:\Users\Naing Aung Zaw\Documents\NodeJS-Lessons\Lesson1
console.log(path.basename(__filename)); // server.js
console.log(path.extname(__filename)); // .js
console.log(path.parse(__filename)); // { root : "C:\\" , dir : "C:\\User...\Lesson1", base:"server.js" , ext:".js" , name ""server" }

// __direname , __filename === path.dirname , path.basename (__filename)

// => Getting our own modules
const math = require("./math");

console.log(math.add(2, 3));
console.log(math.sub(2, 3));
console.log(math.multiply(2, 3));
console.log(math.divide(2, 3).toFixed(2));
