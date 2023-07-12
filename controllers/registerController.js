const usersDB = {
    users: require("../data/users.json"),
    setUsers: function (data) {
        this.users = data;
    },
};
const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd)
        return res
            .status(401)
            .json({ message: "username and password are required" });

    const duplicateUser = usersDB.users.find(
        (person) => person.username === user
    );
    if (duplicateUser) return res.sendStatus(409);

    try {
        const hashedPw = await bcrypt.hash(pwd, 10);
        const newUser = {
            username: user,
            password: hashedPw,
            roles: { User: 2001 },
        };
        usersDB.setUsers([...usersDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, "..", "data", "users.json"),
            JSON.stringify(usersDB.users)
        );
        console.log(usersDB.users);
        res.status(201).json({ success: `New user ${user} is created` });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = { handleNewUser };
