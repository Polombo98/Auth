const express = require("express");
const cors = require("cors");
const authMiddleware = require("./authMiddleware");
require("dotenv").config();

// Init
const app = express();
const port = 3000;

// Middleware
app.use(cors({ origin: "*" }));
app.use("/", authMiddleware);

// Routes
app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
