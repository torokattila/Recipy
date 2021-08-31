const express = require("express");
const app = express();
require("dotenv").config({ path: __dirname + "/.env" });
const cors = require("cors");
const PORT = process.env.PORT || 3001;
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const mysql = require("mysql");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("./middlewares/AuthMiddleware");

app.use(express.json());
app.use(
	cors({
		origin: ["http://localhost:3000"],
		methods: ["GET", "POST", "PUT", "DELETE"]
	})
);
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`App is listening in PORT ${PORT}`);
});