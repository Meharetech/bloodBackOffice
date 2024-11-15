const User = require('../model/UserSchema')
const Donater = require('../model/RequestorSchema');
const Prev = require('../model/PreviousSchema');
const Camp = require('../model/CampSchema');
const Hospital = require('../model/HospitalSchema');
const HospitalDonation = require('../model/HospitalDonationSchema');
const Ngo = require('../model/NgoSchema');
const Admin = require('../model/AdminSchema');
const Banner = require('../model/BannerSchema');
const Event = require('../model/EventSchema');
const Image = require('../model/ImageAdminSchema');
const UserImage = require('../model/UserImagesSchema');
const Emeregency = require('../model/EmeregencyRequestSchema');
const cloudinary = require("cloudinary").v2;

const addDonorsToTheRequest = async (req, res) => {
  try {
    const { phoneNumber, bloodGroup, requestId } = req.body;
    const donorId = req.Id;

    // Find the donor by donorId
    const donor = await User.findById(donorId);

    if (!donor) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    const currentDate = new Date();
    const lastDonation = donor.lastDonation?.date;

    // If there is a last donation date, calculate the time difference
    if (lastDonation) {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

      if (lastDonation > threeMonthsAgo) {
        const previousDonationDate = lastDonation.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });

        return res.status(400).json({
          message: `You can only donate again three months after your previous donation. Last Donation Date :  ${previousDonationDate}`,
          previousDonationDate,
        });
      }
    }

    // Find the document by requestId
    let donateRequest = await Donater.findById(requestId);

    if (!donateRequest) {
      donateRequest = await Emeregency.findById(requestId)
      if (!donateRequest) {
        return res.status(404).json({ error: 'Request not found' });
      }
    }

    // Push the new donor response into the donorsResponse array
    donateRequest.donorsResponse.push({
      donorId,
      phoneNumber,
      bloodGroup
    });

    // Save the updated document
    await donateRequest.save();
    const responseLength = donateRequest.donorsResponse.length - 1;

    const sentResp = donateRequest.donorsResponse[responseLength];

    return res.status(200).json({
      message: 'Response added successfully on addDonor',
      donorsResponse: sentResp
    });

  } catch (error) {
    console.error('Error adding donor response:', error);
    res.status(500).json({ error: error.message });
  }
};

const getDonorsResponses = async (req, res) => {
  try {
    const { requestId, phoneNumber } = req.query;
    const Id = req.Id;

    // Find the document by requestId
    const user = await Donater.findById(requestId);

    if (!user || user.requestorId != Id) {
      return res.status(404).json({ error: 'Request not found' });
    }

    let donorsResponse = user.donorsResponse;
    const donationDetails = user;

    if (phoneNumber) {
      donorsResponse = donorsResponse.find(response => response.phoneNumber == phoneNumber);

      if (!donorsResponse) {
        return res.status(404).json({ error: 'No donor response found for the provided phone number' });
      }
    }

    return res.status(200).json({ donorsResponse });
  } catch (error) {
    console.error('Error fetching donor responses:', error);
    res.status(500).json({ error: error.message });
  }
}


const uploadUserImage = async (req, res) => {

  const { imageUrl } = req.body; // Ensure you get necessary fields
  const { Id } = req; // Ensure you're getting the correct user ID

  try {
    // Find user by Id
    const user = await User.findById(Id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const name = user.name;
    const userNumber = user.userNumber;

    // Check if the user already has an image
    const existingImage = await UserImage.findOne({ userNumber });

    if (existingImage) {
      const existingImageUrl = existingImage.imageLink; // Check if existingImage exists
      const publicId = existingImageUrl.split('/').pop().split('.')[0]; // Extract public ID

      // Delete from Cloudinary
      await cloudinary.uploader.destroy(publicId);

      // Update the existing image with the new URL
      existingImage.imageLink = imageUrl;
      await existingImage.save(); // Save changes
      return res.status(200).json({ message: 'Image updated successfully', existingImage });
    }

    // If user does not have an image, create a new one
    const newUserImage = new UserImage({
      imageLink: imageUrl,
      name, // Use userName for consistency
      userNumber,
    });

    // Save new user image to the database
    await newUserImage.save();

    return res.status(201).json({ message: 'Image uploaded successfully', newUserImage });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const getUserImage = async (req, res) => {
  const { Id } = req; // Ensure you're getting the correct user ID

  try {
    // Find user by Id
    const user = await User.findById(Id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userNumber = user.userNumber;

    // Check if the user already has an image
    const existingImage = await UserImage.findOne({ userNumber });

    if (!existingImage) {
      return res.status(200).json({ msg: "No image found for this user" });
    }

    const imageUrl = existingImage.imageLink;

    return res.status(200).json({ imageUrl }); // Changed to 200 to indicate success
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: 'Server error', error });
  }
}


const donationsControllerApi = async (req, res) => {
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

const getAllDonations = async (req, res) => {
  try {
    const allBloodRequests = await Donater.find();
    const getAllEmergencyRequests = await Emeregency.find();
    const previousRequests = await Prev.find();
    res.status(200).json({ allBloodRequests, getAllEmergencyRequests, previousRequests })
  } catch (error) {
    res.status(500).json({ message: 'Server error ', error });
  }
}

module.exports = { addDonorsToTheRequest, getDonorsResponses, uploadUserImage, getUserImage, donationsControllerApi, getAllDonations };