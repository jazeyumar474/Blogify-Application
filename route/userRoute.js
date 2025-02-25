const express = require("express");
const User = require("../model/userModel");
const Blog = require("../model/blogModel");
const router = express.Router();

// Get Home Page
router.get("/", async (req,res) => {
    const allBlogs = await Blog.find({});
    return res.render("home", {
        user: req.user,
        blogs : allBlogs,
    });
});
// Get SignUp Page
router.get("/signup", (req,res) => {
    return res.render('signup');
});
// Post Route Signup
router.post("/signup", async (req,res) => {
    const {fullName, email, password, confirmPassword, contact} = req.body;

     // Check if passwords match
     if (password !== confirmPassword) {
        return res.status(400).send("Passwords do not match!");
    }

    // Validate contact length (must be exactly 11 digits)
    if (!/^\d{11}$/.test(contact)) {
        return res.status(400).send("Contact must be exactly 11 digits!");
    }

    await User.create({
        fullName,
        email,
        password,
        contact
    });
    return res.redirect("/signin");
});
// Get SignIn Page
router.get("/signin", (req,res) => {
    return res.render('signin');
});
// SignIn Post
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        res.cookie("token", token);
        return res.redirect("/");
    } catch (error) {
        return res.render("signin", {
            error: error.message
        });
    }
});
// Logout Route
router.get("/logout",(req,res) => {
    res.clearCookie("token").redirect("/");
});
router.get("/search", async (req, res) => {
    const searchQuery = req.query.query;
    if (!searchQuery) {
        return res.redirect("/");
    }

    // Find blogs where title or body contains the search query (case insensitive)
    const searchResults = await Blog.find({
        $or: [
            { title: { $regex: searchQuery, $options: "i" } },
            { body: { $regex: searchQuery, $options: "i" } }
        ]
    });

    return res.render("searchResults", {
        user: req.user,
        blogs: searchResults,
        query: searchQuery
    });
});

module.exports = router;