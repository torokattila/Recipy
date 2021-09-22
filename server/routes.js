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

		const getUsernameQuery =
			"SELECT username, google_id FROM user WHERE id = ?;";

		db.query(getUsernameQuery, userId, (error, result) => {
			if (error) {
				console.log(error);
				res.json({ error: "User does not exist!" });
			} else if (result.length > 0) {
				res.json({
					user: req.user,
					username: result[0].username,
					google_id: result[0].google_id
				});
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
								id: googleUser[0].id,
								google_id: googleUser[0].google_id
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
											id: googleInsertResult.insertId,
											google_id: googleId
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
												id: selectResult[0].id,
												google_id:
													selectResult[0].google_id
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
												id: insertResult.insertId,
												google_id: null
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

	app.post("/api/createrecipe", validateToken, (req, res) => {
		let recipe = req.body;
		const userId = req.user.id;
		const insertRecipeQuery =
			"INSERT INTO recipies SET user_id = ?, title = ?, content = ?, created_at = NOW();";

		recipe.title = recipe.title.trim();

		if (recipe.title === "") {
			res.json({ error: "Add a title to your recipe!" });
		} else {
			db.query(
				insertRecipeQuery,
				[userId, recipe.title, recipe.preparation],
				(insertError, insertResult) => {
					if (insertError) {
						console.log(insertError);
						res.json({
							error: "Something went wrong, please try again!"
						});
					} else if (insertResult) {
						res.json({ success: "Created the recipe" });
					}
				}
			);
		}
	});

	app.get("/api/getrecipies", validateToken, (req, res) => {
		const userId = req.user.id;
		const selectRecipiesQuery =
			"SELECT * FROM recipies WHERE user_id = ? ORDER BY created_at DESC";

		db.query(selectRecipiesQuery, userId, (selectError, selectResult) => {
			if (selectError) {
				console.log(selectError);
				res.json({ error: "Cannot get the recipies!" });
			} else if (selectResult) {
				const listOfRecipies = JSON.parse(JSON.stringify(selectResult));

				res.json({ recipiesList: listOfRecipies });
			}
		});
	});

	app.delete("/api/deleterecipe/:recipeId", validateToken, (req, res) => {
		const recipeId = req.params.recipeId;
		const deleteRecipeQuery = "DELETE FROM recipies WHERE recipe_id = ?;";

		db.query(deleteRecipeQuery, recipeId, (deleteError, deleteResult) => {
			if (deleteError) {
				console.log(deleteError);
				res.json({
					error:
						"There was an error with the delete, please try again!"
				});
			} else if (deleteResult) {
				res.json("Recipe deleted!");
			}
		});
	});

	app.put("/api/editprofile", validateToken, (req, res) => {
		const {
			oldUsername,
			newUsername,
			oldPassword,
			newPassword,
			googleId
		} = req.body;
		const userId = req.user.id;
		const getUserQuery = "SELECT * FROM user WHERE username = ?;";

		if (!googleId) {
			db.query(
				getUserQuery,
				oldUsername,
				(getUserError, getUserResult) => {
					if (getUserError) {
						console.log(getUserError);
						res.json({
							error: "There is no user with this username!"
						});
					} else if (getUserResult.length > 0) {
						if (
							newUsername !== "" &&
							oldPassword !== "" &&
							newPassword !== ""
						) {
							bcrypt.hash(
								newPassword,
								saltRounds,
								(hashError, hashedPassword) => {
									if (hashError) {
										console.log(hashError);
										res.json({ error: hashError });
									}

									const updateAllCredentialsQuery =
										"UPDATE user SET username = ?, password = ? WHERE id = ?;";

									db.query(
										updateAllCredentialsQuery,
										[newUsername, hashedPassword, userId],
										(updateError, updateResult) => {
											if (updateError) {
												console.log(updateError);
												res.json({
													error:
														"There was an error with the update, please try again!"
												});
											} else if (updateResult) {
												res.json({
													successMessage:
														"Updated profile datas!"
												});
											}
										}
									);
								}
							);
						} else if (
							newUsername !== "" &&
							oldPassword === "" &&
							newPassword === ""
						) {
							const updateUsernameQuery =
								"UPDATE user SET username = ? WHERE id = ?;";

							db.query(
								updateUsernameQuery,
								[newUsername, userId],
								(updateError, updateResult) => {
									if (updateError) {
										console.log(updateError);
										res.json({
											error:
												"There was an error with the update, please try again!"
										});
									} else if (updateResult) {
										res.json({
											successMessage:
												"Username updated successfully!"
										});
									}
								}
							);
						} else if (newUsername === "") {
							if (oldPassword === "" || newPassword === "") {
								res.json({
									error:
										"You have to fill both old password and new password fields!"
								});
							} else {
								bcrypt.compare(
									oldPassword,
									getUserResult[0].password,
									(
										comparePasswordError,
										comparePasswordResult
									) => {
										if (!comparePasswordResult) {
											res.json({
												error: "Wrong old password!"
											});
										} else if (comparePasswordResult) {
											bcrypt.hash(
												newPassword,
												saltRounds,
												(hashError, hashedPassword) => {
													if (hashError) {
														console.log(hashError);
														res.json({
															error: hashError
														});
													}

													const updatePasswordQuery =
														"UPDATE user SET password = ? WHERE id = ?;";

													db.query(
														updatePasswordQuery,
														[
															hashedPassword,
															userId
														],
														(
															updateError,
															updateResult
														) => {
															if (updateError) {
																console.log(
																	updateError
																);
																res.json({
																	error:
																		"There was an error with the update, please try again!"
																});
															} else if (
																updateResult
															) {
																res.json({
																	successMessage:
																		"Password updated successfully!"
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
						}
					}
				}
			);
		} else {
			res.json({
				error: "You are not able to edit Google credentials!"
			});
		}
	});

	app.delete("/api/deleteprofile", validateToken, (req, res) => {
		const userId = req.user.id;
		const deleteProfileQuery = "DELETE FROM user WHERE id = ?; DELETE FROM recipies WHERE user_id = ?;";

		db.query(deleteProfileQuery, [userId, userId], (deleteError, deleteResult) => {
			if (deleteError) {
				console.log(deleteError);
				res.json({ error: "There was an error with the deletion, try again please!" });
			} else if (deleteResult) {
				res.json("Profile deleted!");
			}
		});
	});
};
