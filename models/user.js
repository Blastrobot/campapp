const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema ({
    email: {
        type: String,
        require: true,
        unique: true
    }
    // We are not adding username or password to the Schema, because passport-local-mongoose is gonna add on those objects for us
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);