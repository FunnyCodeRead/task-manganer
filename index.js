const express = require("express");
require("dotenv").config();
var cors = require("cors");
const bodyParser = require("body-parser");
const routerV1 = require("./api/version1/router/index.router");
const app = express();
const port = process.env.PORT;
const database = require("./config/database");
var cookieParser = require("cookie-parser");

database.connect();
// Middleware để parse JSON
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cookieParser());
//cors
app.use(
  cors({
    origin: "http://localhost:3000", // Cho frontend
  })
);
// Router v1
routerV1(app);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
