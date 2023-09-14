const express = require("express");
const router = express.Router();
const passport = require("passport")
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const { storeReturnTo } = require("../middleware");

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post("/register", catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                next(err)
            } else {
                req.flash("success", "Welcome to BlastCamp! 🥰");
                res.redirect("/campgrounds");
            }
        })
    } catch (e) {
        req.flash("error", e.message); // the catched error will contain a message, this is just coming from my passport implementation
        res.redirect("/register");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post("/login", storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
    req.flash("success", "Welcome back! 🙌🏾");
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    res.redirect(redirectUrl);
})

router.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            next(err);
        } else {
            req.flash("success", "See you soon! 👋🏽")
            res.redirect("/campgrounds");
        }
    });
})

module.exports = router;