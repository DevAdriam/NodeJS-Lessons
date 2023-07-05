const usersDB = {
	users: require("../data/users.json"),
	setUsers: function (data) {
		this.users = data;
	},
};

const bcrypt = require("bcrypt");

const handleLogin = async (req, res) => {
	const { user, pwd } = req.body;
	if (!user || !pwd) return res.status(400).json({ message: "username and password are required" });

	const foundUser = usersDB.users.find((person) => person.username === user);
	if (!foundUser) return res.sendStatus(401); // Unauthorized

	const matchPw = await bcrypt.compare(pwd, foundUser.password);

	if (matchPw) {
		return res.json({ message: `${user} is logged in` });
	} else {
		return res.sendStatus(401);
	}
};

module.exports = { handleLogin };
