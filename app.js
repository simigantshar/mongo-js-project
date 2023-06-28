const path = require("path");
const http = require ("http");
const express = require("express");
const {routesInit} = require("./routes/configRoutes");
require("./db/mongoConnect");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
routesInit(app);

const server = http.createServer(app);

const port = process.env.PORT || 3003;
server.listen(port);