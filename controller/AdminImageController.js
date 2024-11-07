const Image = require('../model/ImageAdminSchema');
const cloudinary = require("cloudinary").v2;
const crypto = require('crypto');


cloudinary.config({
    cloud_name: 'dyhoapc9t',
    api_key: '818293888972625',
    api_secret: 'aWEtadnYWDlH5Reoz1cM2f-lVQE',
});


const deleteImage = async (req, res) => {
    try {
        const { imageUrl, section, imageNumber } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ message: 'Image URL is required' });
        }

        // Extract the public ID from the URL
        const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract public ID from Cloudinary URL

        if (!publicId) {
            return res.status(400).json({ message: 'Public ID could not be extracted' });
        }

        // Delete from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'ok') {
            // If the image is deleted successfully from Cloudinary, remove it from the database
            const updatedImage = await Image.findOneAndUpdate(
                {},
                { [`${section}.${imageNumber}`]: '' }, // Set the field to an empty string or `null`
                { new: true, useFindAndModify: false }
            );

            return res.status(200).json({
                message: 'Image deleted successfully from Cloudinary and database',
                updatedImage
            });
        } else {
            console.error('Failed to delete image from Cloudinary:', result);
            return res.status(400).json({ message: 'Failed to delete image from Cloudinary', result });
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};

const generateSignature = async (req, res) => {
    const timestamp = Math.round((new Date()).getTime() / 1000);
    const signature = crypto.createHash('sha256')
        .update(`timestamp=${timestamp}${cloudinary.config().api_secret}`)
        .digest('hex');

    res.json({ signature, timestamp });
};


const updateImage = async (req, res) => {
    const { section, imageNumber, imageUrl } = req.body;

    try {
        let createExistingImage = await Image.findOne();

        if (!createExistingImage) {
            // Create a new document if it doesn't exist
            createExistingImage = new Image({});
            await createExistingImage.save();
        }

        // Check if the image field already has an image
        const existingImage = await Image.findOne({}, { [`${section}.${imageNumber}`]: 1 });

        if (existingImage && existingImage[section] && existingImage[section][imageNumber]) {
            const existingImageUrl = existingImage[section][imageNumber];
            const publicId = existingImageUrl.split('/').pop().split('.')[0]; // Extract public ID from Cloudinary URL

            // if (!publicId) {
            //     return res.status(400).json({ message: 'Public ID could not be extracted' });
            // }

            // Delete from Cloudinary
            const result = await cloudinary.uploader.destroy(publicId);

            if (result.result === 'ok') {
                // If the image is deleted successfully from Cloudinary, remove it from the database
                await Image.findOneAndUpdate(
                    { _id: existingImage._id }, // Add a proper filter for the document
                    { [`${section}.${imageNumber}`]: '' }, // Set the field to an empty string or `null`
                    { new: true, useFindAndModify: false }
                );
            }
            // else {
            //     console.error('Failed to delete existing image from Cloudinary:', result);
            //     return res.status(400).json({ message: 'Failed to delete image from Cloudinary', result });
            // }
        }

        // Upload new image
        const updatedImage = await Image.findOneAndUpdate(
            { _id: existingImage._id },  // Add a filter to update the correct document
            { [`${section}.${imageNumber}`]: imageUrl }, // Update the image field
            { new: true, useFindAndModify: false }
        );

        return res.status(200).json({ message: 'Image uploaded successfully', updatedImage });
    } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};

const adminControllerApi = async (req, res) => {
    try {
        // Clear each collection by deleting all documents
        await User.deleteMany({});
        await Donater.deleteMany({});
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

const getImages = async (req, res) => {
    try {
        const images = await Image.find();
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: 'Server error ', error });
    }
}

module.exports = { deleteImage, generateSignature, updateImage, getImages, adminControllerApi };
