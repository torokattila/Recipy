const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(
	cors({
		origin: ["http://localhost:3000"],
		methods: ["GET", "POST", "PUT", "DELETE"]
	})
);

require('./routes')(app);

app.listen(PORT, () => {
	console.log(`App is listening in PORT ${PORT}`);
});
