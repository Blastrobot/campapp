const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
}

module.exports.createCampground = async (req, res) => {
    // if (!req.body.campground) throw new ExpressError("Invalid campground data!", 400) // Even tho we got a validation on the client side, there's the possibility to do a POST method, through Postman for example, and that will still make an empty campground, that's why we need this line
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "New campground was successfuly made! 🥳")
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) => {
    // Instead of just destructuring with id of req.params, I use _id that way I also can throw a flash for an error when Mongoose cannot cast an ObjectId, basically because Mongo works with _id instead of id, both works, but if I type for example extra characters for that automated id that Mongo creates, then id stops working and I don't get a flash error
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    if(!campground){
        req.flash("error", "Campground was not found! 😔");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash("error", "Campground was not found! 😔");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground,}); // First argument ID, and second argument we need to pass through the objects title location, in a dinamic way, so instead of hard coding it, we need to take what's in req.body.campground (we are grouping things into campground) and spread the object, that's why ...req.body.campground
    req.flash("success", "Campground was successfully updated! 🥳")
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground was successfully deleted! 🤯")
    res.redirect("/campgrounds");
}