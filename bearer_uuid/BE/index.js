const express = require("express");
const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");
const cors = require("cors");
const createAuthMiddleware = require("./authMiddleware");
require("dotenv").config();

// init
const app = express();
const port = 3000;

// In-memory user and token stores
const users = [
	{
		username: process.env.AUTH_USER,
		password: process.env.AUTH_PASSWORD,
	},
];
const tokenStore = new Map();

const authMiddleware = createAuthMiddleware(tokenStore);

// middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(bodyParser.json());

// routes
app.post("/login", (req, res) => {
	const { username, password } = req.body;
	const user = users.find(
		(u) => u.username === username && u.password === password
	);

	if (!user) return res.status(401).send("Invalid credentials");

	const token = uuidv4();
	tokenStore.set(token, { username });

	res.json({ token });
});

app.get("/dashboard", authMiddleware, (req, res) => {
	res.send(`Welcome, ${req.user.username}`);
});

app.post("/logout", authMiddleware, (req, res) => {
	const token = req.headers["authorization"].split(" ")[1];
	tokenStore.delete(token);
	res.send("Logged out");
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});

module.exports = tokenStore;
