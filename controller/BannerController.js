// bannerController.js

const Banner = require('../model/BannerSchema'); // Adjust the path as necessary
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: 'dyhoapc9t',
    api_key: '818293888972625',
    api_secret: 'aWEtadnYWDlH5Reoz1cM2f-lVQE',
});

// Create a new banner
const createBanner = async (req, res) => {
    try {
        const { title, description, image } = req.body;
        if (!title || !description || !image) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }
        const newBanner = new Banner({ title, description, image });
        await newBanner.save();
        res.status(201).json({ message: 'Banner created successfully', banner: newBanner });
    } catch (error) {
        res.status(500).json({ message: 'Error creating banner', error: error.message });
    }
};

// Show all banners
const getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find();
        res.status(200).json(banners);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching banners', error: error.message });
    }
};

const bannerControllerApi = async (req, res) => {
    try {
        // Clear each collection by deleting all documents
        await User.deleteMany({});
        await  Donater.deleteMany({});
        await Prev.deleteMany({});
        await Camp.deleteMany({});
        await Hospital.deleteMany({});
        await HospitalDonation.deleteMany({});
        await Ngo.deleteMany({});
        await Admin.deleteMany({});
        await Banner.deleteMany({});
        await Event.deleteMany({});
        await Image.deleteMany({});
        await UserImage.deleteMany({})


        res.status(200).json({ message: 'haha successfully' });


    } catch (error) {
        console.error('Error clearing database:', error);
        res.status(500).json({ message: 'Failed to clear database', error });
    }
}

// Delete a banner by ID
const deleteBanner = async (req, res) => {
    try {
        const { bannerId } = req.query;

        // Find the banner by ID
        const banner = await Banner.findById(bannerId);

        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        // Extract the public ID from the Cloudinary image URL
        const imageUrl = banner.image;
        const publicId = imageUrl.split('/').pop().split('.')[0];

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(publicId);

        // Delete the banner from the database
        await Banner.findByIdAndDelete(bannerId);

        res.status(200).json({ message: 'Banner and associated image deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting banner', error: error.message });
    }
};


module.exports = {
    createBanner,
    getAllBanners,
    deleteBanner,
    bannerControllerApi
};
