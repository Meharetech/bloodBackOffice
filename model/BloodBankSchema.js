const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
    bloodGroup: {
        type: String,
        required: true,
        match: /^(A|B|AB|O)[+-]$/i, // Add 'i' flag to make it case-insensitive
    },
    amount: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
});

const HospitalBankSchema = new mongoose.Schema({
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    bloodTypes: [bankSchema],
});

const HospitalBank = mongoose.model('HospitalBank', HospitalBankSchema);

module.exports = HospitalBank;