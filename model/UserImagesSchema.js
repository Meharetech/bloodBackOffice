const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    imageLink: {
        type: String,
        required: true,
        default: "cloudinaryImageLink" // Default value for imageOne
    },
    name: {
        type: String,
        // required: true,
    },
    userNumber: {
        type: Number,
        unique: true, // Ensure unique userNumber for each user
        required: true,
        index: true // Add index for faster lookup
    },
});

const UserImage = mongoose.model('UserImage', imageSchema);

module.exports = UserImage;
