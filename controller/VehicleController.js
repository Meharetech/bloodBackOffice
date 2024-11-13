// controllers/volunteerVehicleController.js

const VolunteerVehicle = require("../model/VehicleSchema");


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
        });

        // Save to the database
        await newVehicle.save();

        return res.status(201).json({
            message: 'Vehicle registered successfully',
            vehicle: newVehicle,
        });
    } catch (error) {
        console.error('Error registering vehicle:', error);
        return res.status(500).json({ error: 'Failed to register vehicle' });
    }
};

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

module.exports = { registerVehicle,getVehicleByPincode }