// ownerSchema.js

const mongoose = require('mongoose')

const BannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
})


const Banner = mongoose.model('Banner', BannerSchema);

module.exports = Banner;