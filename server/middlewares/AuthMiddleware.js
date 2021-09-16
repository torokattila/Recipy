const { verify } = require("jsonwebtoken");
require("dotenv").config({ path: __dirname + "../.env" });

const validateToken = (req, res, next) => {
	const accessToken = req.header("accessToken");

	if (!accessToken) {
		return res.json({ error: "User does not logged in!" });
	} else {
		try {
			const validToken = verify(
				accessToken,
				process.env.ACCESS_TOKEN_SECRET
			);
			req.user = validToken;

			if (validToken) {
				return next();
			}
		} catch (error) {
			return res.json({ error: error });
		}
	}
};

module.exports = { validateToken };
