const express = require('express');
const path = require("path");
const cookieParser = require('cookie-parser');
// Projects Routes
const userRoute = require("./route/userRoute");
const blogRoute = require("./route/blogRoute");

// Database Connection
const mongoose = require('mongoose');
const { checkForAuthenticationCookie } = require('./middleware/authenticationMiddleware');
mongoose.connect("mongodb://localhost:27017/blogify")
.then(() => console.log("Successfully Connected To Mongodb Database"))
.catch(err => console.error("MongoDB Connection Error:", err));;

const app = express();
const PORT = 8000;

app.set("view engine","ejs");
app.set("views", path.resolve("./views"));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.use("/",userRoute);
app.use("/blog", blogRoute);

app.listen(`${PORT}`, () => console.log(`Server Is Running On ${PORT}`));