const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const createAuthMiddleware = require("./JWTMiddleware");
require("dotenv").config();

const app = express();
const port = 3000;
const authMiddleware = createAuthMiddleware(jwt);

// middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(bodyParser.json());

// dummy users
const users = [
	{
		username: process.env.AUTH_USER,
		password: process.env.AUTH_PASSWORD,
	},
];

// routes
app.post("/login", (req, res) => {
	const { username, password } = req.body;
	const user = users.find(
		(u) => u.username === username && u.password === password
	);

	if (!user) return res.status(401).send("Invalid credentials");

	const token = jwt.sign({ username }, process.env.JWT_SECRET, {
		expiresIn: "15m",
	});

	res.json({ token });
});

// protected routes
app.get("/dashboard", authMiddleware, (req, res) => {
	res.send(`Welcome, ${req.user.username}`);
});

// start server
app.listen(port, () => {
	console.log(`JWT Auth server running on http://localhost:${port}`);
});
