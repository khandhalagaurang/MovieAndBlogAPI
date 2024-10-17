const blogModel = require("../model/blog");
const fs = require("fs");
const path = require("path");

const createBlog = async (req, res) => {
    try {
        let { title, content } = req.body;
        let findblog = await blogModel.findOne({ title });
        if (findblog) {
            return res.status(409).json({
                msg: "Blog alredy exist"
            })
        }
        if (!req.file) {
            return res.status(400).json({ msg: "Image is required" });
        }
        let blog = await blogModel.create({
            title, content, image: req.file.filename, user: req.session.user.id
        });
        res.status(201).json(blog);

    } catch (error) {
        res.send(error.message)
    }
};

const getBlog = async (req, res) => {
    try {
        let allData = await blogModel.find();
        res.send(allData);
    } catch (error) {
        res.send(error.message);
    }
};

const readOneBlog = async (req, res) => {
    try {
        let id = req.params.id;
        let data = await blogModel.findById(id);
        res.send(data);
    } catch (error) {
        res.send(error.message);
    }
};

const updateBlog = async (req, res) => {
    try {
        let id = req.params.id;
        let { title, content } = req.body;
        // console.log(req.body);

        let blog = await blogModel.findOne({ _id: id });
        if (!blog) {
            return res.status(400).send("Blog not found");
        }
        let filename = blog.image;
        // console.log(filename);
        if (req.file) {
            filename = req.file.filename;
            const oldFileName = blog.image;
            const image_path = path.join(__dirname, `../public/images/${oldFileName}`);
            fs.unlinkSync(image_path);
        };
        let updatedBlog = await blogModel.findByIdAndUpdate(id, { title, content, image: filename }, { new: true })
        res.status(200).send(updatedBlog);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteBlog = async (req, res) => {
    try {
        let id = req.params.id;
        let blog = await blogModel.findOne({ _id: id });
        if (!blog) {
            return res.status(400).send("Blog not found");
        }
        const img = blog.image;
        const image_path = path.join(__dirname, `.././public/images/${img}`);

        fs.unlinkSync(image_path);
        let deleteBlog = await blogModel.findByIdAndDelete(id);
        console.log(deleteBlog);
        res.send("Blog deleted");
    } catch (error) {
        res.send(error.message);
    }
};

module.exports = { createBlog, getBlog, readOneBlog, deleteBlog, updateBlog };