const mongoose = require('mongoose');
const passportMongoose = require('passport-local-mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
});

userSchema.plugin(passportMongoose);

const User = mongoose.model('User', userSchema);
module.exports = User;