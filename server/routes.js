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
		const { languageToBackend } = req.query;

		const getUsernameQuery =
			"SELECT username, google_id FROM user WHERE id = ?;";

		db.query(getUsernameQuery, userId, (error, result) => {
			if (error) {
				console.log(error);
				res.json({
					error:
						languageToBackend === "EN"
							? "User does not exist!"
							: "Nem létezik ilyen felhasználó"
				});
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
		const { username, password, googleId, languageToBackend } = req.body;

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
								error:
									languageToBackend === "EN"
										? "There is no user with this google ID!"
										: "Nem létezik felhasználó ilyen Google azonosítóval!"
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
												languageToBackend === "EN"
													? "There was an error with Google login, please try again!"
													: "Hiba a Google bejelentkezéssel, kérjük próbálja újra!"
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
							languageToBackend === "EN"
								? "You have to fill in both username and password field!"
								: "A felhasználónév és a jelszó mező kitöltése kötelező!"
					});
				} else if (username.trim() === "") {
					res.json({
						error:
							languageToBackend === "EN"
								? "Please fill in the username field!"
								: "A felhasználónév mező kitöltése kötelező!"
					});
				} else if (password.trim() === "") {
					res.json({
						error:
							languageToBackend === "EN"
								? "Please fill in the password field!"
								: "A jelszó mező kitöltése kötelező!"
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
										languageToBackend === "EN"
											? "There is no user with this username!"
											: "Nem található felhasználó ilyen felhasználónévvel!"
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
												error:
													languageToBackend === "EN"
														? "Wrong password! "
														: "Hibás jelszó!"
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
								res.json({
									error:
										languageToBackend === "EN"
											? "Wrong credentials!"
											: "Hibás bejelentkezési adatok!"
								});
								console.log("Wrong credentials!");
							}
						}
					);
				}
			}
		} catch (error) {
			res.json({
				error:
					languageToBackend === "EN"
						? "There was an error with the Login process, please try again!"
						: "Hiba adódott a bejelentkezéssel, kérjük próbálja újra!"
			});
		}
	});

	const saltRounds = 10;

	app.post("/api/register", (req, res) => {
		let { username, password, passwordAgain, languageToBackend } = req.body;

		username = username.trim();
		password = password.trim();
		passwordAgain = passwordAgain.trim();

		const sqlSelectUserByUsername =
			"SELECT username FROM user WHERE username = ?";
		const sqlInsertUser = "INSERT INTO user SET username = ?, password = ?";

		if (username === "" && password === "" && passwordAgain === "") {
			res.json({
				error:
					languageToBackend === "EN"
						? "Please fill all the input fields!"
						: "Az összes mező kitöltése kötelező!"
			});
		} else if (username === "") {
			res.json({
				error:
					languageToBackend === "EN"
						? "Username field is required!"
						: "A Felhasználónév mező kitöltése kötelező!"
			});
		} else if (password === "") {
			res.json({
				error:
					languageToBackend === "EN"
						? "Password field is required!"
						: "A Jelszó mező kitöltése kötelező!"
			});
		} else if (passwordAgain === "") {
			res.json({
				error:
					languageToBackend === "EN"
						? "Confirm password field is required!"
						: "A Jelszó megerősítése mező kitöltése kötelező!"
			});
		} else if (password !== passwordAgain) {
			res.json({
				error:
					languageToBackend === "EN"
						? "Password and Confirm password field must match!"
						: "A Jelszó és a Jelszó megerősítése mező nem egyezik!"
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
							error:
								languageToBackend === "EN"
									? "This username is already exist, please choose a different username!"
									: "Ilyen felhasználónévvel már létezik felhasználó, kérjük válasszon másik felhasználónevet!",
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
													languageToBackend === "EN"
														? "There was an error with the registration, please try again!"
														: "Hiba adódott a regisztrációval, kérjük próbálja újra!"
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
		let { title, preparation, languageToBackend } = req.body;

		const userId = req.user.id;
		const insertRecipeQuery =
			"INSERT INTO recipies SET user_id = ?, title = ?, content = ?, created_at = NOW();";

		title = title.trim();

		if (title === "") {
			res.json({
				error:
					languageToBackend === "EN"
						? "Add a title to your recipe!"
						: "Adj meg egy címet vagy nevet a receptednek!"
			});
		} else {
			db.query(
				insertRecipeQuery,
				[userId, title, preparation],
				(insertError, insertResult) => {
					if (insertError) {
						console.log(insertError);
						res.json({
							error:
								languageToBackend === "EN"
									? "Something went wrong, please try again!"
									: "Hiba adódott,kérjük próbálja újra!"
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
		const { languageToBackend } = req.body;
		const deleteRecipeQuery = "DELETE FROM recipies WHERE recipe_id = ?;";

		db.query(deleteRecipeQuery, recipeId, (deleteError, deleteResult) => {
			if (deleteError) {
				console.log(deleteError);
				res.json({
					error:
						languageToBackend === "EN"
							? "There was an error with the delete, please try again!"
							: "Hiba adódott a törléssel, kérjük próbálja újra!"
				});
			} else if (deleteResult) {
				res.json(
					languageToBackend === "EN"
						? "Recipe deleted!"
						: "Recept törölve!"
				);
			}
		});
	});

	app.put("/api/editprofile", validateToken, (req, res) => {
		const {
			oldUsername,
			newUsername,
			oldPassword,
			newPassword,
			googleId,
			languageToBackend
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
							error:
								languageToBackend === "EN"
									? "There is no user with this username!"
									: "Nem létezik felhasználó ilyen felhasználónévvel!"
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
														languageToBackend ===
														"EN"
															? "There was an error with the update, please try again!"
															: "Hiba adódott a szerkesztéssel, kérjük próbáld újra!"
												});
											} else if (updateResult) {
												res.json({
													successMessage:
														languageToBackend ===
														"EN"
															? "Updated profile datas!"
															: "Profil adatok frissítve!"
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
												languageToBackend === "EN"
													? "There was an error with the update, please try again!"
													: "Hiba adódott a szerkesztéssel, kérjük próbáld újra!"
										});
									} else if (updateResult) {
										res.json({
											successMessage:
												languageToBackend === "EN"
													? "Username updated successfully!"
													: "Felhasználónév frissítve!"
										});
									}
								}
							);
						} else if (newUsername === "") {
							if (oldPassword === "" || newPassword === "") {
								res.json({
									error:
										languageToBackend === "EN"
											? "You have to fill both old password and new password fields!"
											: "Mindkét jelszó mező kitöltése kötelező!"
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
												error:
													languageToBackend === "EN"
														? "Wrong old password!"
														: "Hibás régi jelszó!"
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
																		languageToBackend ===
																		"EN"
																			? "There was an error with the update, please try again!"
																			: "Hiba adódott a szerkesztéssel, kérjük próbáld újra!"
																});
															} else if (
																updateResult
															) {
																res.json({
																	successMessage:
																		languageToBackend ===
																		"EN"
																			? "Password updated successfully!"
																			: "Jelszó frissítve!"
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
				error:
					languageToBackend === "EN"
						? "You are not able to edit Google credentials!"
						: "Nincs jogosultságod szerkeszteni a Google adatokat!"
			});
		}
	});

	app.delete("/api/deleteprofile", validateToken, (req, res) => {
		const userId = req.user.id;
		const { languageToBackend } = req.body;
		const deleteProfileQuery =
			"DELETE FROM user WHERE id = ?; DELETE FROM recipies WHERE user_id = ?;";

		db.query(
			deleteProfileQuery,
			[userId, userId],
			(deleteError, deleteResult) => {
				if (deleteError) {
					console.log(deleteError);
					res.json({
						error:
							languageToBackend === "EN"
								? "There was an error with the deletion, try again please!"
								: "Hiba adódott a törléssel, kérjük próbáld újra!"
					});
				} else if (deleteResult) {
					res.json(
						languageToBackend === "EN"
							? "Profile deleted!"
							: "Profil törölve!"
					);
				}
			}
		);
	});
};
