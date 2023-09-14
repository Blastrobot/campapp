module.exports.isLoggedIn = (req, res, next) => {
    // console.log("req.user is this:", req.user); // this is there by passport, it is going to be automatically filled in with the deserialized information from the session, so the session store is serialized using passport
    if(!req.isAuthenticated()){ // this method is coming from passport
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be logged in first! 🙄");
        res.redirect("/login");
    } else {
        next();
    }
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}