const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual("thumbnail").get(function() {
    return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true }}; // Virtuals are normally not inside the response in the JSON include, that's why this is needed to include that data in the JSON, making it accessible

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
}, opts);

CampgroundSchema.virtual("properties.popUpMarkup").get(function() {
    return `
    <a href="/campgrounds/${this._id}">${this.title}</a>
    <p>${this.description.substring(0, 30)}...</p>`; // this refers to a particular campground instance
})

// This mongoose Middleware is to have access to the object that has been deleted, that way we can access references, for example, any review that might've been done on a camp, we can then use the IDs for those reviews, on the deleted camp, to also delete the reviews
CampgroundSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

// Compiling our model to export it
module.exports = mongoose.model("Campground", CampgroundSchema);
