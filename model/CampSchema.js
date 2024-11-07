const mongoose = require('mongoose');

const campSchema = new mongoose.Schema({
    organiserId: String,
    campName: {
        type: String,
        required: true,
    },
    campAddress: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
    deleteAt: {
        type: Date,
        required: true,
    }
});

// Ensure TTL index on `deleteAt` field
// campSchema.index({ deleteAt: 1 }, { expireAfterSeconds: 0 });

// campSchema.pre('save', function (next) {
//     this.deleteAt = this.endDate;
//     next();
// });

const Camp = mongoose.model('Camp', campSchema);

module.exports = Camp;
