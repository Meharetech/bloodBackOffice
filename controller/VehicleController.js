// controllers/volunteerVehicleController.js

const VolunteerVehicle = require("../model/VehicleSchema");
const { sendOtpViaSMS } = require("./UserController");


// Register a new volunteer vehicle
const registerVehicle = async (req, res) => {
    try {
        const {
            ownerName,
            vehicleType,
            licensePlate,
            pincode,
            capacity,
            contactNumber,
            availability,
            dateOfAvailability,
            availableDays,
        } = req.body;

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Calculate expiration date based on availableDays
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + parseInt(availableDays));

        // Create a new volunteer vehicle record
        const newVehicle = new VolunteerVehicle({
            ownerName,
            vehicleType,
            licensePlate,
            pincode,
            capacity,
            contactNumber,
            availability,
            dateOfAvailability,
            availableDays,
            expirationDate,
            otp,
        });

        // Save to the database
        await newVehicle.save();

        // Send OTP via SMS
        await sendOtpViaSMS(contactNumber, otp, ownerName);

        return res.status(201).json({
            message: 'Vehicle registered successfully. Verify OTP within 10 minutes.',
            vehicleId: newVehicle._id,
        });
    } catch (error) {
        console.error('Error registering vehicle:', error);
        return res.status(500).json({ error: 'Failed to register vehicle' });
    }
};

const verifyVehicleOtp = async (req, res) => {
    try {
        const { contactNumber, otp } = req.body;

        // Find the vehicle record by ID and OTP
        const vehicle = await VolunteerVehicle.findOne({contactNumber, otp });

        if (!vehicle) {
            return res.status(400).json({ error: 'Invalid OTP or vehicle not found' });
        }

        // Verify OTP and mark the vehicle as verified
        vehicle.isVerified = true;
        vehicle.verificationTimestamp = new Date(); // Record the verification time

        // Save the changes
        await vehicle.save();

        return res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ error: 'Failed to verify OTP' });
    }
};


const getAllVehicles = async (req, res) => {
    try {
        const vehicles = await VolunteerVehicle.find();
        return res.status(200).json(vehicles);
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        return res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
}

const getVehicleByPincode = async (req, res) => {
    try {
        const { pincode } = req.query;

        // Validate that pincode is a 6-digit number
        if (!/^\d{6}$/.test(pincode)) {
            return res.status(400).json({ error: 'Invalid pincode. It must be a 6-digit number.' });
        }
        // Query the database for vehicles with the given pincode
        const vehicles = await VolunteerVehicle.find({ pincode });

        if (vehicles.length === 0) {
            return res.status(404).json({ message: 'No vehicles found for this pincode.' });
        }

        return res.status(200).json(vehicles);
    } catch (error) {
        console.error('Error retrieving vehicles by pincode:', error);
        return res.status(500).json({ error: 'Server error. Could not fetch vehicles.' });
    }
};

// Update Vehicle
const updateVehicleDetails = async (req, res) => {
    const { id } = req.query;
    const {
        ownerName,
        vehicleType,
        licensePlate,
        pincode,
        capacity,
        contactNumber,
        availability,
        dateOfAvailability,
        availableDays,
        expirationDate
    } = req.body;

    try {
        // Find the vehicle by ID
        const vehicle = await VolunteerVehicle.findById(id);

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Update the vehicle details
        vehicle.ownerName = ownerName || vehicle.ownerName;
        vehicle.vehicleType = vehicleType || vehicle.vehicleType;
        vehicle.licensePlate = licensePlate || vehicle.licensePlate;
        vehicle.pincode = pincode || vehicle.pincode;
        vehicle.capacity = capacity || vehicle.capacity;
        vehicle.contactNumber = contactNumber || vehicle.contactNumber;
        vehicle.availability = availability !== undefined ? availability : vehicle.availability;
        vehicle.dateOfAvailability = dateOfAvailability || vehicle.dateOfAvailability;
        vehicle.availableDays = availableDays || vehicle.availableDays;
        vehicle.expirationDate = expirationDate || vehicle.expirationDate;

        // Save the updated vehicle
        const updatedVehicle = await vehicle.save();

        res.json(updatedVehicle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete Vehicle
const deleteVehicle = async (req, res) => {
    const { vehicleId } = req.query;

    try {
        // Find and delete the vehicle by ID
        const vehicle = await VolunteerVehicle.findByIdAndDelete(vehicleId);

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerVehicle, getAllVehicles, verifyVehicleOtp, getVehicleByPincode, updateVehicleDetails, deleteVehicle }