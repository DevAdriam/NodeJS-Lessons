const usersDB = {
    users: require("../data/users.json"),
    setUsers: function (data) {
        this.users = data;
    },
};

const bcrypt = require("bcrypt");
const path = require("path");
const fsPromises = require("fs").promises;
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd)
        return res
            .status(400)
            .json({ message: "username and password are required" });

    const duplicateUser = usersDB.users.find(
        (person) => person.username === user
    );
    if (duplicateUser) return res.sendStatus(409);

    try {
        const hashedPw = await bcrypt.hash(pwd, 10);
        const newUser = { username: user, password: hashedPw };

        usersDB.setUsers([...usersDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, "..", "data", "users.json"),
            JSON.stringify(usersDB.users)
        );

        res.status(201).json({ message: `new user ${user} is created` });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const login = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.sendStatus(401);

    const foundUser = usersDB.users.find((person) => person.username === user);
    if (!foundUser) return res.sendStatus(401);

    const matchPw = await bcrypt.compare(foundUser.password, pwd);
    if (!matchPw) return res.sendStatus(401);

    const accessToken = jwt.sign(
        { username: foundUser.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
    );

    const refreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
    );

    const otherUsers = usersDB.users.filter(
        (person) => person.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };

    usersDB.setUsers([...otherUsers, currentUser]);

    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 2460 * 60 * 60 * 1000,
    });
    res.send(accessToken);
};

const refreshToken = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = usersDB.users.find(
        (person) => person.refreshToken === refreshToken
    );
    if (!foundUser) return res.sendStatus(401);

    jwt.verify("jwt", refreshToken, (err, decoded) => {
        if (err || foundUser.username !== decoded.username) {
            return res.sendStatus(401);
        } else {
            const accessToken = jwt.sign(
                { username: decoded.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "30s" }
            );
            return res.send(accessToken);
        }
    });
};

const logout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(204);
    }
    const refreshToken = cookies.jwt;

    const foundUser = usersDB.users.find(
        (person) => person.refreshToken === refreshToken
    );
    if (!foundUser) {
        res.clearCookie("jwt", { httpOnly: true });
        return res.sendStatus(204);
    }

    const otherUsers = usersDB.users.filter(
        (person) => person.refreshToken !== foundUser.refreshToken
    );
    const currentUser = { ...foundUser, refreshToken: "" };

    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, "..", "data", "users.json")
    );
    res.send(204);
};
