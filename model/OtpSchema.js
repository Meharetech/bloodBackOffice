// ownerSchema.js

const mongoose = require('mongoose')

const otp = new mongoose.Schema({
  bloodGroup: String,
  name: String,
  phoneNumber: String,
  email: String,
  password: String,
  token: String,
  otp: Number,
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
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  isVerified: { type: Boolean, default: false }, // Correctly defined
});


const Otp = mongoose.model('Otp', otp);

module.exports = Otp;