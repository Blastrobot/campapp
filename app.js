if(process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express"); // Starts our connection with Express
const app = express(); // Starts our connection with Express
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const { campgroundSchema, reviewSchema } = require("./schemas");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");

// We start our connection to our Mongo DB through mongoose
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("DB connected!");
});

// Makes our connection to EJS, so we can show those views
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Tell express to parse the request body from our POST requests
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "public")));

const sessionConfig = {
    secret: "possiblenotagoodsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // Method coming from passport-local-mongoose to serialize the user (how to store the user)
passport.deserializeUser(User.deserializeUser()); // Method coming from passport-local-mongoose to deserialize the user (how to unstore the user)

// I had this following middleware before the passport.initialize(), passport.session and the rest, and it was not allowing me to show dynamically a logout button when already signed in, because the req.user was coming before all of the necessary from passport i guess
app.use((req, res, next) => {
    // console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

// Render from our first Home page

app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.get("/", (req, res) => {
    res.render("home");
});

app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404));
})

app.use((err, req, res, next) => {
    // const { statusCode = 500, message = "Something went wrong :(" } = err;
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong! 😔"
    res.status(statusCode).render("error", { err });
});

// Starts our connection with Express
app.listen(3000, () => {
    console.log("Serving on port 3000");
});
