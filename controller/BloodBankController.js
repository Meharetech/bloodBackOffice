const HospitalBank = require("../model/BloodBankSchema")

const addOrUpdateHospitalBank = async (req, res) => {
    try {
        // Extract hospitalId from the token
        const { id } = req;
        const { name, address, bloodTypes } = req.body;

        // Validate input
        if (!name || !address || !Array.isArray(bloodTypes)) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        // Find the hospital by hospitalId
        let hospital = await HospitalBank.findOne({ hospitalId: id });

        if (hospital) {
            // Update hospital details
            hospital.name = name;
            hospital.address = address;

            // Manage bloodTypes: update existing or add new
            bloodTypes.forEach((newBloodType) => {
                const existingType = hospital.bloodTypes.find(
                    (bt) => bt.bloodGroup === newBloodType.bloodGroup
                );

                if (existingType) {
                    // Update amount for existing blood group
                    existingType.amount = newBloodType.amount;
                } else {
                    // Add new blood group
                    hospital.bloodTypes.push(newBloodType);
                }
            });

            // Save updated hospital
            await hospital.save();

            return res.status(200).json({ message: "Hospital details updated successfully", data: hospital });
        }

        // Create a new hospital if it doesn't exist
        const newHospital = new HospitalBank({
            hospitalId: id,
            name,
            address,
            bloodTypes,
        });

        await newHospital.save();

        res.status(201).json({ message: "Hospital added successfully", data: newHospital });
    } catch (error) {
        console.error("Error in addOrUpdateHospitalBank:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const getBloodBankDetails = async (req, res) => {
    try {
        // Extract the hospitalId from the token
        const { id } = req;

        // Find the hospital by hospitalId
        const hospital = await HospitalBank.findOne({ hospitalId: id });

        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        res.status(200).json(hospital);
    } catch (error) {
        console.error("Error in getHospitalDetails:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getALLBloodBankDetails = async (req, res) => {
    try {
        const hospitals = await HospitalBank.find().populate("hospitalId","-password");
        res.status(200).json(hospitals);
    } catch (error) {
        res.status(500).json({ message: 'Server error ', error });
    }
}

// Export the controller functions
module.exports = {
    addOrUpdateHospitalBank,
    getBloodBankDetails,
    getALLBloodBankDetails
};
