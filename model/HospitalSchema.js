const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hospitalSchema = new Schema({
    name: { type: String, required: true },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true }
    },
    contact: {
        phone: { type: String, required: true },
        email: { type: String, required: true }
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    hasBloodDonationCenter: { type: Boolean, default: false },
    website: { type: String, default: '' },
    specialInstructions: { type: String, default: '' },
    password: String,
    status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
    token: String,
});

const Hospital = mongoose.model('Hospital', hospitalSchema);

module.exports = Hospital;
