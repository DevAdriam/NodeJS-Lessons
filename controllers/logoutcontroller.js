const usersDB = {
	users: require("../data/users.json"),
	setUsers: function (data) {
		this.users = data;
	},
};
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fsPromises = require("fs").promises;
const path = require("path");

const handleRefreshToken = (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(401);

	const refreshToken = cookies.jwt;

	const foundUser = userDB.users.find((person) => person.refreshToken === refreshToken);
	if (!foundUser) return res.sendStatus(403);

	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
		if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
		const accessToken = jwt.sign({ username: decoded.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
		res.json({ accessToken });
	});
};

const handleLogin = async (req, res) => {
	const { user, pwd } = req.body;
	if (!user || !pwd) return res.status(400).json({ message: "username and password are required" });

	const foundUser = usersDB.users.find((person) => person.username === user);
	if (!foundUser) return res.sendStatus(401);

	const matchPw = await bcrypt.compare(pwd, foundUser.password);
	if (!matchPw) return res.sendStatus(401);

	const accessToken = jwt.sign({ username: foundUser.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
	const refreshToken = jwt.sign({ username: foundUser.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });

	const otherUsers = usersDB.users.filter((person) => person.username !== foundUser.username);
	const currentUser = { ...foundUser, refreshToken };
	usersDB.setUsers([...otherUsers, currentUser]);

	await fsPromises.writeFile(path.join(__dirname, "..", "data", "users.json"), JSON.stringify(usersDB.users));

	res.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
	res.json({ accessToken });
};
