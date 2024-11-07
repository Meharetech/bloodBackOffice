// ownerSchema.js

const mongoose = require('mongoose')

const HospitalprevReq = new mongoose.Schema({
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

const HospitalPrev = mongoose.model('HospitalPrev', HospitalprevReq);

module.exports = HospitalPrev;