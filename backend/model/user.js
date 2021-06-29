const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

userSchema = new Schema({
  name: { type: String, required: true },
  username: {type: String , require: true , unique: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  dob: { type: String },
  resetToken: String,
  expireToken: Date,
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
