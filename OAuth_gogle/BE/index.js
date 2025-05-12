const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = 3000;

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

// redirect to Google
app.get("/auth/google", (req, res) => {
	const params = new URLSearchParams({
		client_id: process.env.GOOGLE_CLIENT_ID,
		redirect_uri: process.env.GOOGLE_REDIRECT_URI,
		response_type: "code",
		scope: "openid email profile",
		access_type: "offline",
		prompt: "consent",
	});
	res.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
});

// handle callback and exchange code for token
app.get("/auth/google/callback", async (req, res) => {
	const code = req.query.code;
	if (!code) return res.status(400).send("No code provided");

	try {
		const response = await axios.post(GOOGLE_TOKEN_URL, null, {
			params: {
				code,
				client_id: process.env.GOOGLE_CLIENT_ID,
				client_secret: process.env.GOOGLE_CLIENT_SECRET,
				redirect_uri: process.env.GOOGLE_REDIRECT_URI,
				grant_type: "authorization_code",
			},
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
		});

		const { access_token } = response.data;

		// get user profile info
		const profileRes = await axios.get(GOOGLE_USERINFO_URL, {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		});

		const user = profileRes.data;

		// (Optional) Save to DB / Session
		console.log("User Info:", user);

		res.send(
			`<h1>Hello, ${user.name}</h1><pre>${JSON.stringify(
				user,
				null,
				2
			)}</pre>`
		);
	} catch (err) {
		console.error(err);
		res.status(500).send("Failed to authenticate");
	}
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
