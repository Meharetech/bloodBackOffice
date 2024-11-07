// ownerSchema.js

const mongoose = require('mongoose')

const admin = new mongoose.Schema({
  
  name: String,
  phoneNumber: String,
  password: String,
  token: String,
  joinedOn: {
    type: Date,
    default: Date.now,
  },
});


const Admin = mongoose.model('Admin', admin);

module.exports = Admin;