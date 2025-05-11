const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

// init
const app = express();
const port = 3000;

// middleware
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	})
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			secure: false, // set to true if using HTTPS
			maxAge: 1000 * 60 * 15, // 15 minutes
		},
	})
);

// routes

app.post("/login", (req, res) => {
	const { username, password } = req.body;

	if (
		username === process.env.AUTH_USER &&
		password === process.env.AUTH_PASSWORD
	) {
		req.session.user = { username };
		return res.send("Login successful");
	}

	return res.status(401).send("Invalid credentials");
});

app.post("/logout", (req, res) => {
	req.session.destroy((err) => {
		if (err) return res.status(500).send("Could not log out");
		res.send("Logged out");
	});
});

app.get("/dashboard", (req, res) => {
	if (req.session.user) {
		return res.send(`Welcome, ${req.session.user.username}`);
	}

	return res.status(401).send("Please log in to access this resource");
});

// start server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
