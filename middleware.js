module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){ // this method is coming from passport
        req.flash("error", "You must be logged in first! 🙄");
        res.redirect("/login");
    } else {
        next();
    }
}