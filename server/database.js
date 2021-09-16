require("dotenv").config({ path: __dirname + "/.env" });

const hostName = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_DATABASE;

module.exports = {
	connection: {
		host: hostName,
		user: user,
		password: password
	},
	database: database,
	port: 3306
};
