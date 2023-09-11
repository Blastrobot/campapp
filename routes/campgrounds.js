const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { campgroundSchema } = require("../schemas.js");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(elem => elem.message).join(", ");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get("", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}));

router.get("/new", (req, res) => {
    res.render("campgrounds/new");
});

router.post("/", validateCampground, catchAsync(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError("Invalid campground data!", 400) // Even tho we got a validation on the client side, there's the possibility to do a POST method, through Postman for example, and that will still make an empty campground, that's why we need this line
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    res.render("campgrounds/show", { campground });
}));

router.get("/:id/edit", catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
}));

router.put("/:id", validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    }); // First argument ID, and second argument we need to pass through the objects title location, in a dinamic way, so instead of hard coding it, we need to take what's in req.body.campground (we are grouping things into campground) and spread the object, that's why ...req.body.campground
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}));

module.exports = router;