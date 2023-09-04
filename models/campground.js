const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
});

// Compiling our model to export it
module.exports = mongoose.model("Campground", CampgroundSchema);
