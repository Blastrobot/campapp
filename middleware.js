const { campgroundSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError.js");
const Campground = require("./models/campground.js");

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

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(elem => elem.message).join(", ");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(elem => elem.message).join(", ");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
    // if (campground.author !== req.user._id){
        req.flash("error", "You do not have permission to do that! 😤")
        return res.redirect(`/campgrounds/${campground._id}`); // Don't forget that the return makes sure that if the conditional works, then it will return that to the function and the rest of the code below won't run
    } next();
}