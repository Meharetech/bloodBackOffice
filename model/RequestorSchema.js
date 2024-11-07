
const mongoose = require('mongoose')

const donater = new mongoose.Schema({
    requestorId: String,
    bloodGroup: String,
    name: String,
    phoneNumber: String,
    donorsResponse: [{
        donorId: String,
        phoneNumber: Number,
        bloodGroup: String,
    }],
    location: {
        longitude: Number,
        latitude: Number
    },
    dateOfQuery: {
        type: Date,
        default: Date.now,
    },
    expireAt: {
        type: Date,
        default: () => Date.now() + 25 * 60 * 60 * 1000,
        index: { expireAfterSeconds: 0 },
    },

});

const Donater = mongoose.model('Donater', donater);

module.exports = Donater;