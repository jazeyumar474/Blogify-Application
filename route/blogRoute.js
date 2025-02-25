const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require("../model/blogModel");
const Comments = require("../model/commentModel");
const router = Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads`));
    },
    filename: function (req, file, cb) { // Change 'res' to 'file'
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
});

const upload = multer({ storage : storage })
router.get("/addBlog",(req,res) => {
    return res.render('addBlog',{
        user : req.user,
    });
});
router.post("/addBlog", upload.single("coverImageURL"), async (req, res) => {
    if (!req.user) {
        return res.status(401).send("Unauthorized: Please log in.");
    }
    const { title, body } = req.body;
    const blog = await Blog.create({
        title,
        body,
        coverImageURL: req.file ? `uploads/${req.file.filename}` : null,
        createdBy: req.user._id,
    });
    return res.redirect("/");
});
router.get("/:id", async (req, res) => {
    const blog = await Blog.findById(
        req.params.id
    )
    .populate(
        "createdBy","fullName profileImageUrl"
    );
    const comments = await Comments.find({
        blogId : req.params.id
    }).populate(
        "createdBy"
    );
    console.log("comments",comments);
    return res.render("viewBlog", {
        user: req.user,
        blog,
        comments,
    });
});
router.post("/comment/:blogId", async (req,res) => {
        await Comments.create({
        content : req.body.content,
        blogId : req.params.blogId,
        createdBy : req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});
module.exports = router;