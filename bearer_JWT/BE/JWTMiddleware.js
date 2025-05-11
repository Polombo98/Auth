// Middleware to check JWT
function createJWTAuthenticationMiddleware(JWT) {
	return function authenticateJWT(req, res, next) {
		const authHeader = req.headers["authorization"];
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res
				.status(401)
				.send("Missing or invalid Authorization header");
		}

		const token = authHeader.split(" ")[1];

		try {
			const decoded = JWT.verify(token, process.env.JWT_SECRET);
			req.user = decoded;
			next();
		} catch (err) {
			return res.status(401).send("Invalid or expired token");
		}
	};
}

module.exports = createJWTAuthenticationMiddleware;
