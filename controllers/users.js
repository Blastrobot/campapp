const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
    res.render("users/register");
}

module.exports.register = async (req, res, next) => {
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
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login");
}

// Don't forget that the login is actually made by Passport, we are just redirecting where the user was ;)
module.exports.login = (req, res) => {
    req.flash("success", "Welcome back! 🙌🏾");
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            next(err);
        } else {
            req.flash("success", "See you soon! 👋🏽")
            res.redirect("/campgrounds");
        }
    });
}