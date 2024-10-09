const express = require("express");
const route = express.Router();
const authSession = require("../middleware/auth")
const User = require("../model/user");
const { register, login, logout , getData } = require("../controller/user")

route.post("/register", register);

route.post("/login", login);

route.get("/logout", logout);

route.get("/get_data", authSession , getData)

module.exports = route;