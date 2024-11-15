const jwt = require('jsonwebtoken');


const Admin = require('../model/AdminSchema');
const User = require('../model/UserSchema');
const Donater = require('../model/RequestorSchema');
const Prev = require('../model/PreviousSchema');
const Hospital = require('../model/HospitalSchema');
const HospitalDonation = require('../model/HospitalDonationSchema');
const HospitalPrev = require('../model/HospitalPreviousRecords');
const Event = require('../model/EventSchema');
const UserImage = require('../model/UserImagesSchema');

const adminJwtSecret = 'asdfGHJKL123$%^&*QWER!@#4%^&*!%^#QTYE^@$YEW@^WYEHre5';

const adminVerifyToken = async (req, res, next) => {
    // console.log("user is in admin token verification")
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });

    }

    try {
        const decodedToken = jwt.verify(token, adminJwtSecret);
        const user = await Admin.findById(decodedToken.id);

        if (!user) {
            return res.status(401).json({ message: 'Invalid user' });
        }

        if (user.token !== token) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = user;
        req.Id = decodedToken.id;
        req.phoneNumber = user.phoneNumber;
        next();
    } catch (error) {
        console.error('Failed to verify token:', error);
        return res.status(500).json({ message: 'Failed to verify token', error: error.message });
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;
        const user = await Admin.findOne({ phoneNumber });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }


        if (password == user.password) {
            const token = jwt.sign({ id: user._id }, adminJwtSecret, { expiresIn: '60d' });
            user.token = token;
            await user.save();
            console.log("User logged in:", user, token);
            return res.status(200).json({ message: 'Login successful', token });

        } else {
            return res.status(401).json({ error: 'Invalid password' });
        }
    } catch (error) {
        console.error('Login failed:', error);
        res.status(500).json({ error: error.message });
    }
};



const approveStatus = async (req, res) => {
    console.log("user is in approve status")
    const { id } = req.body;

    try {
        const user = await User.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const approveHospital = async (req, res) => {
    console.log("user is in approve status")
    const { id } = req.body;

    try {
        const hospital = await Hospital.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
        if (!hospital) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(hospital);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const pendingUsers = async (req, res) => {
    try {
        // console.log("user is in pendingUsers")
        const pendingUsers = await User.find({ status: 'pending', isVerified: true });
        const notVerifiedUsers = await User.find({ status: 'pending', isVerified: false });
        const pendingHospitals = await Hospital.find({ status: 'pending' })
        const registeredUsers = await User.find({ status: 'approved' });
        const registeredHospitals = await Hospital.find({ status: 'approved' });
        res.status(200).json({ pendingUsers, pendingHospitals, registeredUsers, registeredHospitals, notVerifiedUsers });
    } catch (error) {
        console.error('Error fetching pending users:', error);
        res.status(500).json({ message: 'Server error fetching pending users', error: error.message });
    }

}


const deleteUser = async (req, res) => {
    try {
        const { id } = req.query;
        console.log(id)
        // Delete the user
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User Have Been Removed' });

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error deleting user', error: error.message });
    }
}

const deleteHospital = async (req, res) => {
    try {
        const { id } = req.query;
        console.log(id)
        // Delete the user
        const hospital = await Hospital.findByIdAndDelete(id);
        if (!hospital) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User Have Been Removed' });

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error deleting user', error: error.message });
    }
}

const adminUserControllerApi = async (req, res) => {
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

const userDetails = async (req, res) => {
    try {

        const { requestId } = req.query;
        console.log(requestId);
        const userDetails = await User.findById(requestId);
        const userImage = await UserImage.find({ userNumber: userDetails.userNumber })
        const donationRequests = await Donater.find({ requestorId: requestId })
        const previousDonationRequests = await Prev.find({ requestorId: requestId })

        res.status(200).json({ userDetails, donationRequests, previousDonationRequests, userImage });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error in user Details', error: error.message });
        resErr
    }
}

const deleteBloodRequestAdmin = async (req, res) => {
    try {
        const { id } = req.query;  // Get the blood request ID from query
        const { Id } = req;

        const admin = Admin.findById(Id);

        // Find the blood request by its ID
        const donation = await Donater.findById(id);

        // Check if the user exists and if the requestor ID matches the logged-in user ID
        if (admin) {
            // Delete the blood request
            await Donater.findByIdAndDelete(id);
            return res.status(200).json({ message: "Blood Request deleted successfully." });
        }

        // If user not authorized, send a 403 Forbidden response
        return res.status(403).json({ message: "You are not authorized to perform this action." });

    } catch (error) {
        // Catch and return any server errors
        return res.status(500).json({ message: 'Server error in delete Blood Request.', error: error.message });
    }
};

const HospitalDetails = async (req, res) => {
    try {

        const { requestId } = req.query;
        console.log(requestId);
        const hospitalDetails = await Hospital.findById(requestId);
        const donationRequests = await HospitalDonation.find({ requestorId: requestId })
        const previousDonationRequests = await HospitalPrev.find({ requestorId: requestId })

        res.status(200).json({ hospitalDetails, donationRequests, previousDonationRequests });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error in user Details', error: error.message });
        resErr
    }
}

const getDonorsResponsesAdmin = async (req, res) => {
    try {
        const { requestId } = req.query;

        // Find the document by requestId
        const user = await Donater.findById(requestId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const donorsResponse = user.donorsResponse || []; // Ensure donorsResponse is always an array

        if (donorsResponse.length === 0) {
            return res.status(200).json({ message: "No donors response found.", donorsResponse });
        }

        // Send the donorsResponse array in the response
        return res.status(200).json({ message: "Donors response found.", donorsResponse });
    } catch (error) {
        console.error('Error fetching donor responses:', error);
        return res.status(500).json({ error: error.message });
    }
};


const getHospitalDonorsResponsesAdmin = async (req, res) => {
    try {
        const { requestId } = req.query;
        console.log(requestId);

        // Find the document by requestId
        const user = await HospitalDonation.findById(requestId);

        // Send the donorsResponse array in the response
        return res.status(200).json({ donorsResponse: user.donorsResponse });

    } catch (error) {
        console.error('Error fetching donor responses:', error);
        res.status(500).json({ error: error.message });
    }
}

const setNewEvent = async (req, res) => {
    try {
        const { eventName, eventLocation, eventDate, eventDescription } = req.body;
        const event = await Event.create({
            eventName,
            eventLocation,
            eventDate,
            eventDescription
        });
        return res.status(201).json({ message: 'Event created successfully', event });
    } catch (error) {
        res.status(500).json({ message: 'Server error ', error: error.message });
    }
}

const getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        return res.status(200).json({ events });
    } catch (error) {
        res.status(500).json({ message: 'Server error in event', error: error.message });
    }
}

const deleteEvent = async (req, res) => {
    try {
        const { id } = req.query;
        await Event.findByIdAndDelete(id);
        res.status(200).json({ message: "Event Deleted Successfully" })
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting the event', error: error.message });
    }
}

module.exports = { adminUserControllerApi, adminVerifyToken, loginAdmin, deleteUser, deleteBloodRequestAdmin, deleteHospital, approveStatus, approveHospital, pendingUsers, userDetails, HospitalDetails, getDonorsResponsesAdmin, getHospitalDonorsResponsesAdmin, setNewEvent, getEvents, deleteEvent };
