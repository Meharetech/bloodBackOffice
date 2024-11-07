
const mongoose = require('mongoose')

const hospitalDonation = new mongoose.Schema({
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
        type: {
            type: String, // GeoJSON type, which should always be 'Point'
            enum: ['Point'], // Only allow 'Point'
            required: true
        },
        coordinates: {
            type: [Number], // Array of numbers for [longitude, latitude]
            required: true
        }
    },
    dateOfQuery: {
        type: Date,
        default: Date.now,
    },
    expireAt: {
        type: Date,
        default: () => Date.now() + 24 * 60 * 60 * 1000,
        index: { expireAfterSeconds: 0 },
    },

});

const HospitalDonation = mongoose.model('HospitalDonation', hospitalDonation);

module.exports = HospitalDonation;