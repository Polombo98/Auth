function basicAuthMiddleware(req, res, next) {
	// Check if the request has an authorization header
	const authHeader = req.headers["authorization"];

	//Validate the authorization header
	if (!authHeader || !authHeader.startsWith("Basic ")) {
		res.setHeader("WWW-Authenticate", 'Basic realm="Secured"');
		return res.status(401).send("Authentication required");
	}

	// Decode the base64 encoded credentials
	const base64Creds = authHeader.split(" ")[1];
	const credentials = Buffer.from(base64Creds, "base64").toString("ascii");
	const [username, password] = credentials.split(":");

	// Check if the credentials are valid
	if (
		username === process.env.BASIC_AUTH_USER &&
		password === process.env.BASIC_AUTH_PASSWORD
	) {
		return next(); // Proceed to next middleware or route
	}

	// If credentials are invalid, send a 401
	res.setHeader("WWW-Authenticate", 'Basic realm="Restricted Area"');
	return res.status(401).send("Invalid credentials");
}

module.exports = basicAuthMiddleware;
