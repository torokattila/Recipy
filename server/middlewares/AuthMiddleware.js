const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
	const accessToken = req.header("accessToken");

	if (!accessToken) {
		return res.json({ error: "User does not logged in!" });
	} else {
		try {
			const validateToken = verify(accessToken, "tOkEnSeCrEt");
			req.user = validateToken;

			if (validateToken) {
				return next();
			}
		} catch (error) {
			return res.json({ error: error });
		}
	}
};

module.exports = { validateToken };
