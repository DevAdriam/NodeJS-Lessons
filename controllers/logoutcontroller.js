const usersDB = {
    users: require("../data/users.json"),
    setUsers: function (data) {
        this.users = data;
    },
};

const fsPromises = require("fs").promises;
const path = require("path");

const handleLogout = async (req, res) => {
    // on Client side , also delete the access token
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // no content
    const refreshToken = cookies.jwt;

    // //is Refresh Token in Database ?
    const foundUser = usersDB.users.find(
        (person) => person.refreshToken === refreshToken
    );
    if (!foundUser) {
        res.clearCookie("jwt", { httpOnly: true });
        return res.sendStatus(204);
    }

    // //delete Refresh Token in Database?
    const otherUsers = usersDB.users.filter(
        (person) => person.refreshToken !== refreshToken
    );
    const currentUser = { ...foundUser, refreshToken: "" };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, "..", "data", "users.json"),
        JSON.stringify(usersDB.users)
    );

    res.clearCookie("jwt", { httpOnly: true }); // {secure : true } only serves to HTTPS
    res.sendStatus(204);
    // res.json({ message: "bugs" });
};

module.exports = { handleLogout };
