// ownerSchema.js

const mongoose = require('mongoose')

const addUser = new mongoose.Schema({
  bloodGroup: String,
  name: String,
  phoneNumber: String,
  email: String,
  password: String,
  token: String,
  otp: Number,
  userNumber: {
    type: Number,
    unique: true, // Ensure unique userNumber for each user
    required: true,
    index: true // Add index for faster lookup
  },
  location: {
    longitude: Number,
    latitude: Number,
  },
  lastDonation: {
    date: { type: Date },
    donatedTo: { type: String }
  },
  previousDonations: [
    {
      date: { type: Date },
      donatedTo: { type: String }
    },
  ],
  joinedOn: {
    type: Date,
    default: Date.now,
  },
  status: { type: String, enum: ['pending', 'approved'], default: 'approved' },
  isVerified: { type: Boolean, default: false }, // Correctly defined
});


const User = mongoose.model('User', addUser);

module.exports = User;