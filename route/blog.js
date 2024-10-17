const express = require("express");
const route = express.Router();
const { createBlog, getBlog, readOneBlog, deleteBlog, updateBlog } = require("../controller/blog");
const authSession = require("../middleware/auth");
const upload = require("../middleware/uploadImg");



route.post("/create", authSession, upload.single("image"), createBlog);
route.get("/getalldata", getBlog);
route.get("/getone/:id", readOneBlog);
route.put("/update/:id", upload.single("image"), updateBlog);
route.delete("/delete/:id", deleteBlog)

module.exports = route;