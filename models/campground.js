const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
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
    ]
});

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
