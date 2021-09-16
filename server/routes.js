const dbconfig = require("./database");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("./middlewares/AuthMiddleware");

const db = mysql.createPool({
	host: dbconfig.connection.host,
	user: dbconfig.connection.user,
	password: dbconfig.connection.password,
	database: dbconfig.database,
	insecureAuth: true,
	multipleStatements: true
});

setInterval(function() {
	db.query("SELECT 1");
}, 4500);

db.query(`USE ${db.database}`);

module.exports = function(app) {
    app.use(bodyParser.urlencoded({ extended: true }));

	app.get("/api/auth", validateToken, (req, res) => {
		const userId = req.user.id;
		const getUsernameQuery = "SELECT username FROM user WHERE id = ?;";

		db.query(getUsernameQuery, userId, (error, result) => {
			if (error) {
				console.log(error);
				res.json({ error: "User does not exist!" });
			} else if (result.length > 0) {
				res.json({ user: req.user, username: result[0].username });
			}
		});
	});

	app.post("/api/login", (req, res) => {
		const { username, password, googleId } = req.body;

		const sqlSelectByUsername = "SELECT * FROM user WHERE username = ?;";
		const sqlSelectByGoogleId = "SELECT * FROM user WHERE google_id = ?;";
		const sqlInsertGoogleUser =
			"INSERT INTO user SET google_id = ?, username = ?;";

		try {
			if (googleId) {
				db.query(
					sqlSelectByGoogleId,
					googleId,
					(googleSelectError, googleUser) => {
						if (googleSelectError) {
							console.log(googleSelectError);
							res.json({
								error: "There is no user with this google ID!"
							});
						}

						if (googleUser.length > 0) {
							const accessToken = sign(
								{
									id: googleUser[0].id
								},
								process.env.ACCESS_TOKEN_SECRET
							);

							res.json({
								token: accessToken,
								username: googleUser[0].username,
								id: googleUser[0].id
							});
						} else if (googleUser.length === 0) {
							db.query(
								sqlInsertGoogleUser,
								[googleId, username],
								(googleInsertError, googleInsertResult) => {
									if (googleInsertError) {
										console.log(googleInsertError);
										res.json({
											error:
												"There was an error with Google login, please try again!"
										});
									} else if (googleInsertResult) {
										const accessToken = sign(
											{
												id: googleInsertResult.insertId
											},
											process.env.ACCESS_TOKEN_SECRET
										);

										res.json({
											token: accessToken,
											username: username,
											id: googleInsertResult.insertId
										});
									}
								}
							);
						}
					}
				);
			} else {
				if (username.trim() === "" && password.trim() === "") {
					res.json({
						error:
							"You have to fill in both username and password field!"
					});
				} else if (username.trim() === "") {
					res.json({
						error: "Please fill in the username field!"
					});
				} else if (password.trim() === "") {
					res.json({
						error: "Please fill in the password field!"
					});
				} else {
					db.query(
						sqlSelectByUsername,
						username,
						(error, selectResult) => {
							if (error) {
								console.log(error);
								res.json({
									error:
										"There is no user with this username!"
								});
							} else if (selectResult.length > 0) {
								bcrypt.compare(
									password,
									selectResult[0].password,
									(
										comparePasswordError,
										comparePasswordResult
									) => {
										if (!comparePasswordResult) {
											res.json({
												error: "Wrong password! "
											});
										} else if (comparePasswordResult) {
											const accessToken = sign(
												{
													id: selectResult[0].id
												},
												process.env.ACCESS_TOKEN_SECRET
											);

											res.json({
												token: accessToken,
												username: username,
												id: selectResult[0].id
											});
										}
									}
								);
							} else {
								res.json({ error: "Wrong credentials!" });
								console.log("Wrong credentials!");
							}
						}
					);
				}
			}
		} catch (error) {
			res.json({
				error:
					"There was an error with the Login process, please try again!"
			});
		}
	});

	const saltRounds = 10;

	app.post("/api/register", (req, res) => {
		let { username, password, passwordAgain } = req.body;
		
		username = username.trim();
		password = password.trim();
		passwordAgain = passwordAgain.trim();

		const sqlSelectUserByUsername =
			"SELECT username FROM user WHERE username = ?";
		const sqlInsertUser = "INSERT INTO user SET username = ?, password = ?";

		if (username === "") {
			res.json({ error: "Username field is required!" });
		} else if (password === "") {
			res.json({ error: "Password field is required!" });
		} else if (passwordAgain === "") {
			res.json({ error: "Confirm password field is required!" });
		} else if (password !== passwordAgain) {
			res.json({
				error: "Password and Confirm password field must match!"
			});
		} else {
			db.query(
				sqlSelectUserByUsername,
				username,
				(selectError, selectResult) => {
					if (selectError) {
						console.log(selectError);
						res.json(selectError);
					} else if (selectResult.length > 0) {
						res.json({
							error: "This username is already exist!",
							success: false
						});
					} else {
						bcrypt.hash(
							password,
							saltRounds,
							(hashError, hashedPassword) => {
								if (hashError) {
									console.log(hashError);
									res.json(hashError);
								}

								db.query(
									sqlInsertUser,
									[username, hashedPassword],
									(insertError, insertResult) => {
										if (insertError) {
											console.log(insertError);
											res.json({
												error:
													"There was an error with the registration, please try again!"
											});
										} else if (insertResult) {
											const accessToken = sign(
												{
													id: insertResult.insertId
												},
												process.env.ACCESS_TOKEN_SECRET
											);

											res.json({
												token: accessToken,
												username: username,
												id: insertResult.insertId
											});
										}
									}
								);
							}
						);
					}
				}
			);
		}
	});
};
