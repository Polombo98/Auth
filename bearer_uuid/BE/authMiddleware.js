function createAuthMiddleware(tokenStore) {
	return function authMiddleware(req, res, next) {
		const authHeader = req.headers["authorization"];
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).send("Unauthorized");
		}

		const token = authHeader.split(" ")[1];
		const user = tokenStore.get(token);
		if (!user) return res.status(401).send("Invalid token");

		req.user = user;
		next();
	};
}

module.exports = createAuthMiddleware;
