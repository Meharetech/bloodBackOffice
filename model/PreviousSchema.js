// ownerSchema.js

const mongoose = require('mongoose')

const prevReq = new mongoose.Schema({
    requestorId:String,
    bloodGroup: String,
    name: String,
    phoneNumber:String,
    location: {
        longitude: Number,
        latitude: Number
    },
    dateOfQuery: {
        type: Date,
        default: Date.now,
    },
});

const Prev = mongoose.model('Prev', prevReq);

module.exports = Prev;