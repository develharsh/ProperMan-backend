const express = require("express");
const path = require("path");
require("dotenv").config();

const route = require("./routes");

const app = express();

const cors = require("cors");
const logger = require("morgan");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

const DBConnection = require("./database.js");
const dbc = new DBConnection();
dbc.connect();

app.use(logger("common"));
app.use("/api/v1", route);
app.use("/api/test", (_, res) => {
  res.status(200).json({ success: true, message: "Backend is working fine." });
});

const port = process.env.NODE_APP_PORT || 3333;
app.listen(port, function () {
  console.log("Express app running on port " + port);
});