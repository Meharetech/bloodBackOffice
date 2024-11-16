// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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
const { default: axios } = require('axios');
const Emeregency = require('../model/EmeregencyRequestSchema');
const { response } = require('express');

const jwtSecret = 'Thr0bZyphrnQ8vkJumpl3BaskEel@ticsXzylN!gmaPneuma';

const sendOtpViaSMS = async (mobile, otp, userName) => {
    try {
        console.log("user in otv via sms => ", mobile, otp, userName);
        const response = await axios.post('https://backend.aisensy.com/campaign/t1/api/v2', {
            "apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OGUyMGFmMmM2MjQ5MThjZWY4MWI0NiIsIm5hbWUiOiJpaW5zYWYtbmV3IiwiYXBwTmFtZSI6IkFpU2Vuc3kiLCJjbGllbnRJZCI6IjY2OGI4MjY4NTk4MWY4MTkzNjkwZDE4OCIsImFjdGl2ZVBsYW4iOiJCQVNJQ19NT05USExZIiwiaWF0IjoxNzIxODEzMTA2fQ.ZhQAF2tICnEtxVfiJS_y8dIdbLtIezK4R7Jd1Z1trw4",
            "campaignName": "copy_otp",
            "destination": `91${mobile}`,
            // "userName": "iinsaf-new",
            "templateParams": [
                `${otp}`
            ],

            "buttons": [
                {
                    "type": "button",
                    "sub_type": "url",
                    "index": 0,
                    "parameters": [
                        {
                            "type": "text",
                            "text": `${otp}`
                        }
                    ]
                }
            ],
        })
        console.log("WhatsApp OTP sent : ", response.data);
        return response.data; // Return response if needed for further handling
    } catch (error) {
        console.error("Error sending WhatsApp OTP:", error);
        throw new Error("Failed to send WhatsApp OTP"); // Throw error for error handling in `sendOtp`
    }
}

const sendBloodRequestWAMessage = async (mobile, bloodGroup, mapLink) => {
    try {
        const response = await axios.post('https://backend.aisensy.com/campaign/t1/api/v2', {
            apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OGUyMGFmMmM2MjQ5MThjZWY4MWI0NiIsIm5hbWUiOiJpaW5zYWYtbmV3IiwiYXBwTmFtZSI6IkFpU2Vuc3kiLCJjbGllbnRJZCI6IjY2OGI4MjY4NTk4MWY4MTkzNjkwZDE4OCIsImFjdGl2ZVBsYW4iOiJCQVNJQ19NT05USExZIiwiaWF0IjoxNzIxODEzMTA2fQ.ZhQAF2tICnEtxVfiJS_y8dIdbLtIezK4R7Jd1Z1trw4",
            campaignName: "blood_request",
            destination: mobile, // Dynamic mobile parameter
            userName: "iinsaf-new",
            templateParams: [
                bloodGroup, // Use bloodGroup dynamically
                mapLink // Use mapLink dynamically
            ],
            source: "new-landing-page form",
            paramsFallbackValue: {
                FirstName: "user"
            }
        });
        return response.data; // Return the response data for further processing
    } catch (error) { // Capture error in the catch block
        console.error("Error sending WhatsApp message:", error);
        throw new Error("Failed to send WhatsApp message"); // Provide specific error context
    }
};


const getCompatibleBloodGroups = (bloodGroup) => {
    switch (bloodGroup) {
        case 'o-': return ['o-', 'o+', 'a-', 'a+', 'b-', 'b+', 'ab-', 'ab+', 'a2-', 'a2+'];
        case 'o+': return ['o+', 'a+', 'b+', 'ab+'];
        case 'a-': return ['a-', 'a+', 'ab-', 'ab+', 'a2-', 'a2b-'];
        case 'a+': return ['a+', 'ab+'];
        case 'b-': return ['b-', 'b+', 'ab-', 'ab+'];
        case 'b+': return ['b+', 'ab+'];
        case 'ab-': return ['ab-', 'ab+'];
        case 'ab+': return ['ab+'];
        case 'a2+': return ['a2+', 'a2b+'];
        case 'a2-': return ['a2-', 'a2b-', 'a2b+', 'o-'];
        case 'a2b+': return ['a2b+'];
        case 'a2b-': return ['a2b-', 'a2b+'];
        case 'hh': return ['hh'];
        case 'inra': return ['inra'];
        default: return [];
    }
}

const userControllerApi = async (req, res) => {
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

const getBloodRequests = async (req, res) => {
    try {
        // const { location } = req.body;
        const { location } = req.query;
        const bloodGroup = req.bloodGroup;
        const lng = Number(location.longitude);
        const lat = Number(location.latitude);
        console.log(lng, lat)

        const radiusInKilometers = 50;
        const earthRadiusInKilometers = 6378.1;
        const radiusInRadians = radiusInKilometers / earthRadiusInKilometers;

        const compatibleBloodGroups = getCompatibleBloodGroups(bloodGroup);

        const query = {
            location: {
                $geoWithin: {
                    $centerSphere: [[lng, lat], radiusInRadians],
                },
            }
        };

        const query2 = {
            location: {
                $geoWithin: {
                    $centerSphere: [[lng, lat], radiusInRadians],
                },
            }
        };

        if (bloodGroup) {
            query.bloodGroup = { $in: compatibleBloodGroups };
        }

        const donaters = await Donater.find(query).limit(100);
        const emergencyRequest = await Emeregency.find(query).limit(100)
        const hospitalRequests = await HospitalDonation.find(query2).limit(200)
        const camps = await Camp.find(query2);
        console.log("number of entries sent =>\n", camps.length);
        donaters.reverse();
        res.status(200).json({ donaters, camps, hospitalRequests, emergencyRequest });

    } catch (error) {
        console.error('Failed to add user:', error);
        res.status(500).json({ error: error.message });
    }
};

const sendBloodRequests = async (req, res) => {
    try {
        const { location, bloodGroup, name } = req.body;
        const { phoneNumber, Id } = req;
        if (!bloodGroup || !name) {
            res.status(500).json("Blood group, and name is required for making a request");
        } else {
            const newUser = await Donater.create({
                requestorId: Id,
                location,
                bloodGroup,
                phoneNumber,
                name,
            });
            console.log(newUser)
            const saveReq = await Prev.create({
                requestorId: Id,
                location,
                bloodGroup,
                phoneNumber,
                name,
            })

            let googleMapsLink = ``;
            if (newUser.location) {
                googleMapsLink = `https://www.google.com/maps?q=${newUser.location.latitude},${newUser.location.longitude}`;
            } else {
                googleMapsLink = `Location Not Provided By the User .`;
            }

            if (newUser) {
                const users = await User.find(); // Assuming `User.find()` retrieves all users

                // Loop through each user and send a message
                for (const user of users) {
                    try {
                        await sendBloodRequestWAMessage(user.phoneNumber, newUser.bloodGroup, googleMapsLink);
                        console.log(`Message sent to ${user.phoneNumber}`);
                    } catch (error) {
                        console.error(`Failed to send message to ${user.phoneNumber}:`, error);
                    }
                }
            }
            res.status(200).json(newUser);
        }
    } catch (error) {
        console.error('Failed to add user:', error);
        res.status(500).json({ error: error.message });
        console.log(error)
    }
}

const sendEmergencyBloodRequests = async (req, res) => {
    try {
        const { location, bloodGroup, name, phoneNumber, city, hospitalName } = req.body;
        const { Id } = req;

        if (!bloodGroup || !name || !phoneNumber || !hospitalName || !city) {
            return res.status(400).json({ message: "Blood group, name and phone number is required." });
        }
        if (!location) {
            location = {
                latitude: "Not Provided",
                longitude: "Not Provided"
            }
        }

        // Generate and send OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        sendOtpViaSMS(phoneNumber, otp, name); // Function to send OTP to user via SMS

        // Set OTP expiry time (10 minutes from now)
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        // Check for existing pending request with the same phone number
        let existingRequest = await Emeregency.findOne({ phoneNumber, status: 'pending' });

        if (existingRequest) {
            // Update existing pending request with new details
            existingRequest.location = location;
            existingRequest.bloodGroup = bloodGroup;
            existingRequest.name = name;
            existingRequest.hospitalName = hospitalName;
            existingRequest.city = city;
            existingRequest.otp = otp;
            existingRequest.otpExpiry = otpExpiry;
            await existingRequest.save();

            res.status(200).json({ message: "Request Sent successfully.", data: existingRequest });
        } else {
            // Create a new request if no pending request exists
            const newUser = await Emeregency.create({
                requestorId: Id || phoneNumber,
                location,
                bloodGroup,
                name,
                hospitalName,
                city,
                phoneNumber,
                name,
                otp,
                otpExpiry,
                status: 'pending' // Default status for new requests
            });

            console.log("New emergency request created:", newUser);

            // Save a record in the Prev collection as well
            const saveReq = await Prev.create({
                requestorId: Id || phoneNumber,
                location,
                bloodGroup,
                phoneNumber,
                name,
            });

            res.status(200).json({ message: "OTP sent to phone number. Please verify.", data: newUser });
        }
    } catch (error) {
        console.error("Failed to add user:", error);
        res.status(500).json({ error: "Failed to create blood request. Please try again." });
    }
};

const verifyEmeregencyOtp = async (req, res) => {
    try {
        console.log("first user is here")
        const { otp, phoneNumber } = req.body;

        if (!otp || !phoneNumber) {
            return res.status(400).json({ message: "OTP and phone number are required." });
        }

        // Find the emergency request with matching phone number, OTP, status pending, and valid expiration
        const emergencyRequest = await Emeregency.findOne({
            phoneNumber,
            otp,
            status: 'pending',
            otpExpiry: { $gt: new Date() } // Ensure OTP is not expired
        });

        if (!emergencyRequest) {
            return res.status(400).json({ message: "Invalid or expired OTP. Please request again if needed." });
        }

        // Update the status to 'approved' upon successful OTP verification
        emergencyRequest.status = 'approved';
        emergencyRequest.otp = null;
        emergencyRequest.otpExpiry = null;

        await emergencyRequest.save();
        let googleMapsLink = ``;
        if (emergencyRequest.location) {
            googleMapsLink = `https://www.google.com/maps?q=${emergencyRequest.location.latitude},${emergencyRequest.location.longitude}`;
        } else {
            googleMapsLink = `Location Not Provided By the User .`;
        }
        if (emergencyRequest.status === 'approved') {
            const users = await User.find(); // Assuming `User.find()` retrieves all users

            // Loop through each user and send a message
            for (const user of users) {
                try {
                    await sendBloodRequestWAMessage(user.phoneNumber, emergencyRequest.bloodGroup, googleMapsLink);
                    console.log(`Message sent to ${user.phoneNumber}`);
                } catch (error) {
                    console.error(`Failed to send message to ${user.phoneNumber}:`, error);
                }
            }
        }

        res.status(200).json({ message: "OTP verified successfully, request approved.", data: emergencyRequest });
    } catch (error) {
        console.error("Failed to verify OTP:", error);
        res.status(500).json({ message: "Server error during OTP verification.", error: error.message });
    }
};

const checkEmergencyBloodRequest = async (req, res) => {
    try {
        const { phoneNumber } = req.query;
        const requests = await Emeregency.find({ phoneNumber });
        if (requests.length > 0) {
            res.status(200).json({ message: 'Emergency blood request found', requests });
        } else {
            res.status(404).json({ message: 'No emergency blood request found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error ', error });
    }
};

const deleteBloodRequest = async (req, res) => {
    try {
        const { id } = req.query;  // Get the blood request ID from query
        const { Id } = req;        // Get the user's ID (who is making the request)

        // Find the blood request by its ID
        const user = await Donater.findById(id);

        // Check if the user exists and if the requestor ID matches the logged-in user ID
        if (user && user.requestorId == Id) {
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


const getUserRequests = async (req, res) => {
    try {
        const { Id } = req;

        const requests = await Donater.find({
            requestorId: Id
        });

        // const allRequests = requests;

        if (requests.length === 0) {
            return res.status(404).json({ message: 'No requests found for this user' });
        }

        requests.reverse();
        res.status(200).json({ requests });

    } catch (error) {
        console.error('Failed to get user requests:', error);
        res.status(500).json({ error: error.message });

    }
};

const donatersDetail = async (req, res) => {
    try {
        const { donaterId } = req.query;
        let response = await Donater.findById(donaterId);
        if (!response) {
            response = await Emeregency.findById(donaterId);
            if (!response) {
                return res.status(404).json({ message: 'Donater not found' });
            }
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
    }
};

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        const decodedToken = jwt.verify(token, jwtSecret);
        const user = await User.findById(decodedToken.id);

        if (!user) {
            return res.status(401).json({ message: 'Invalid user' });
        }

        if (user.token !== token) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = user;
        req.Id = decodedToken.id;
        req.bloodGroup = user.bloodGroup;
        req.phoneNumber = user.phoneNumber;
        next();
    } catch (error) {
        console.error('Failed to verify token:', error);
        return res.status(500).json({ message: 'Failed to verify token', error: error.message });
    }
};

const addUser = async (req, res) => {
    try {
        const { phoneNumber, password, bloodGroup, email, name, ngoName } = req.body;

        if (!phoneNumber || !password || !bloodGroup || !name) {
            return res.status(400).json({ error: 'Phone Number, password, name  and blood group are necessary for customer' });
        }

        const existingNumber = await User.findOne({ phoneNumber });
        if (existingNumber && existingNumber.isVerified) {
            return res.status(400).json({ error: 'Number already exists' });
        }

        if (existingNumber) {
            await User.findByIdAndDelete(existingNumber._id);
        }

        const lastUser = await User.findOne().sort({ userNumber: -1 });

        // Generate the next user number
        const baseUserNumber = lastUser ? lastUser.userNumber + 1 : 1;
        const uniqueUserNumber = baseUserNumber + 12345;

        const newUser = await User.create({
            phoneNumber,
            name,
            password,
            bloodGroup,
            email, // Include email when creating the user
            userNumber: uniqueUserNumber // Assign the unique user number
        });


        if (ngoName) {
            const ngo = await Ngo.create({
                ngoName,
                memberBloodGroup: bloodGroup,
                memberEmail: email,
                memberName: name
            })
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "deepak7009verma@gmail.com",
                pass: "xtehwzivizvxsgja",
            },
        });

        const OTP = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number

        const mailOptions = {
            from: "twoobgmi@gmail.com",
            to: email,
            subject: "OTP Verification",
            text: `Dear sir, The 6-digit OTP for your donation app account is ${OTP}`,
        };

        sendOtpViaSMS(phoneNumber, OTP, name);

        newUser.otp = OTP; // Store the OTP directly or hash it for extra security
        await newUser.save(); // Save the new user with OTP

        // Send the OTP email
        await transporter.sendMail(mailOptions);

        // Respond to client after successful email
        return res.status(201).json({
            message: "OTP sent successfully!",
        });

    } catch (error) {
        console.error('Failed to add user:', error);
        res.status(500).json({ error: error.message });
    }
};

const forgetPasswordOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the email is provided
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        // Check if the user exists
        const user = await User.findOne({ phoneNumber: email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "deepak7009verma@gmail.com",
                pass: "xtehwzivizvxsgja",
            },
        });

        const OTP = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number

        const mailOptions = {
            from: "twoobgmi@gmail.com",
            to: user.email,
            subject: "OTP Verification",
            text: `Dear sir, The 6-digit OTP for your donation app account is ${OTP}`,
        };

        await sendOtpViaSMS(user.phoneNumber, OTP, user.name);

        // Optionally hash the OTP before saving to increase security
        // const hashedOTP = await bcrypt.hash(OTP.toString(), 10);
        user.otp = OTP; // Direct assignment, or assign hashed OTP if hashed
        await user.save(); // Save the user with the OTP

        // Using async/await for better handling of sendMail
        await transporter.sendMail(mailOptions);

        // Respond only after email is successfully sent
        return res.status(200).json({
            message: "OTP sent successfully!",
        });

    } catch (error) {
        console.error('Failed to send OTP:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const verifyOtpResetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ error: 'Email and OTP are required.' });
        }

        // Find the user based on the phone number
        const user = await User.findOne({ phoneNumber: email });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Check if the OTP matches
        if (user.otp != otp) {
            return res.status(400).json({ error: 'Invalid OTP.' });
        }

        if (newPassword) {
            user.password = newPassword;
        }

        // OTP is correct, you can now clear the OTP from the user document and mark the user as verified
        user.otp = null; // Optionally, you may want to nullify the OTP after verification
        user.isVerified = true; // You can set an "isVerified" field to true if you track verification status
        await user.save();

        res.status(200).json({ message: 'Operation successfully!' });
    } catch (error) {
        console.error('Failed to verify OTP:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required.' });
        }

        // Find the user based on the phone number
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Check if the OTP matches
        if (user.otp != otp) {
            return res.status(400).json({ error: 'Invalid OTP.' });
        }

        if (newPassword) {
            user.password = newPassword;
        }

        // OTP is correct, you can now clear the OTP from the user document and mark the user as verified
        user.otp = null; // Optionally, you may want to nullify the OTP after verification
        user.isVerified = true; // You can set an "isVerified" field to true if you track verification status
        await user.save();

        res.status(200).json({ message: 'Operation successfully!' });
    } catch (error) {
        console.error('Failed to verify OTP:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required.' });
        }

        // Find the user based on the email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Generate a new OTP and save it to the user document
        const newOtp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
        user.otp = newOtp;
        await user.save();

        // Send the OTP to the user's email/phone (you need to implement sendOtp function)
        // await sendOtp(user.email, newOtp); // Assuming `sendOtp` is a function that sends the OTP
        await sendOtpViaSMS(user.phoneNumber, newOtp, user.name);

        res.status(200).json({ message: 'OTP has been resent successfully.' });
    } catch (error) {
        console.error('Failed to resend OTP:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


const loginUser = async (req, res) => {
    try {
        const { phoneNumber, password, location } = req.body;
        console.log("location in login user =>", location)
        const user = await User.findOne({ phoneNumber });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.status == 'pending') {
            return res.status(404).json({ error: 'Request Approval Still Pending' });
        }


        if (password == user.password) {
            const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '60d' });
            user.token = token;
            user.location = location;
            await user.save();
            console.log("User logged in:", user);
            return res.status(200).json({ message: 'Login successful', token });

        } else {
            return res.status(401).json({ error: 'Invalid password' });
        }
    } catch (error) {
        console.error('Login failed:', error);
        res.status(500).json({ error: error.message });
    }
};

const approveDonation = async (req, res) => {
    try {
        const { donorId, donationId } = req.body;

        // Find the donor (user)
        const user = await User.findById(donorId);

        // Find the donation request
        const donationRequest = await Donater.findById(donationId);

        if (!donationRequest) {
            return res.status(404).json({ message: 'Donation request not found' });
        }

        const name = donationRequest.name;
        // console.log(donationRequest);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.lastDonation = {
            donatedTo: name,
            date: Date.now(),
        }
        // Add donation to user's previous donations
        user.previousDonations.push({
            donatedTo: name,
            date: Date.now(),
        });

        // Save the updated user
        await user.save();

        // Delete the donation request after it's approved
        await Donater.findByIdAndDelete(donationId);

        res.status(200).json({ message: 'Donation approved, saved, and removed from the request' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const userProfileDetails = async (req, res) => {
    try {
        const { Id } = req;
        const user = await User.findById(Id, { token: 0 });
        const previousRequests = await Prev.find({ requestorId: Id });
        const previousEmergncyRequest = await Emeregency.find({ phoneNumber: user.phoneNumber })
        res.status(200).json({ user, message: "these are the previous requests =>", previousRequests, previousEmergncyRequest });

    } catch (error) {
        res.status(500).json({ message: 'Server error ', error: error.message });

    }
}



module.exports = { sendBloodRequestWAMessage, userControllerApi, addUser, verifyOtp, verifyOtpResetPassword, resendOtp, forgetPasswordOtp, loginUser, userProfileDetails, verifyToken, getBloodRequests, sendBloodRequests, sendEmergencyBloodRequests, verifyEmeregencyOtp, checkEmergencyBloodRequest, deleteBloodRequest, getUserRequests, donatersDetail, approveDonation, sendOtpViaSMS };