
const mongoose = require('mongoose');

const volunteerVehicleSchema = new mongoose.Schema({
    ownerName: {
        type: String,
        required: true,
        trim: true,
    },
    vehicleType: {
        type: String,
        enum: ['Car', 'Truck', 'Van', 'Motorcycle', 'Other'],
        default: 'Car',
    },
    licensePlate: {
        type: String,
        required: true,
        trim: true,
    },
    pincode: {
        type: String,
        required: true,
        trim: true,
    },
    capacity: {
        type: Number,
        required: true,
        min: 1,
    },
    contactNumber: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Contact number must be 10 digits'],
    },
    availability: {
        type: Boolean,
        default: true,
    },
    dateOfAvailability: {
        type: Date,
        required: true,
    },
    availableDays: {
        type: Number,
        min: 1,
        max: 7,
        default: 1,
    },
    expirationDate: {
        type: Date,
        required: true,
    },
    otp: {
        type: String, // Store the OTP for verification
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false, // Set to true after OTP verification
    },
    verificationTimestamp: {
        type: Date, // Timestamp for when OTP was verified
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// TTL index for automatic deletion (after 10 minutes if unverified)
volunteerVehicleSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

const VolunteerVehicle = mongoose.model('VolunteerVehicle', volunteerVehicleSchema);

module.exports = VolunteerVehicle;
