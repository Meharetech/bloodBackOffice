
const mongoose = require('mongoose')


const emergencySchema = new mongoose.Schema({
    requestorId: String,
    name: String,
    city:String,
    hospitalName:{
        type:String
    },
    otp: Number,
    otpExpiry: Date,
    status: {
        type: String,
        enum: ['pending', 'approved'],
        default: 'pending'
    },
    bloodGroup: String,
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

const Emeregency = mongoose.model('Emeregency', emergencySchema);

module.exports = Emeregency;