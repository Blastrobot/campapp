const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedsHelpers");
const Campground = require("../models/campground");

// We start our connection to our Mongo DB through mongoose
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("DB connected!");
});

// array[Math.floor(Math.floor() * array.length)]

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 30) + 10;
    const camp = new Campground({
      author: "650220cef831ffec71081533",
      location: `${cities[random].city}, ${cities[random].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Provident aliquam mollitia impedit eum facilis harum voluptas a quidem id similique, ad beatae facere cupiditate, est eius aliquid tenetur quasi dolorem.",
      price,
      geometry: {
        type: "Point",
        coordinates: [-3.68, 40.4]
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dfhfrk78e/image/upload/v1694787677/BlastCamp/wz7qyddhl0cyrhuqvctw.png',
          filename: 'BlastCamp/wz7qyddhl0cyrhuqvctw',
        },
        {
          url: 'https://res.cloudinary.com/dfhfrk78e/image/upload/v1694787677/BlastCamp/j2nqsx8fy207l3zmzoeq.png',
          filename: 'BlastCamp/j2nqsx8fy207l3zmzoeq',
        },
      ]
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
