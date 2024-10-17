const express = require("express");
const route = express.Router();
const User = require("../model/user");
const { register, login, logout, otpVerifyEmail } = require("../controller/user")

route.post("/register", register);
route.post("/register/otp", otpVerifyEmail);

route.post("/login", login);

route.get("/logout", logout);

module.exports = route;