const express = require("express");
const app = express();
const PORT = 8000;
const route = require("./route/user");
const movieRoute = require("./route/movie");
const blogRoute = require("./route/blog");
require('dotenv').config()
const session = require('express-session');
// const multer = require('multer');

app.use(express.json());
app.use(session({
    secret: process.env.SECRET_KEY || "mysecretekey",
    resave: false,
    saveUninitialized: true,
}));

app.use("/img", express.static("./public/images"))

app.use("/", route);
app.use("/movie", movieRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => {
    console.log(`server started http://localhost:${process.env.PORT}`)
})