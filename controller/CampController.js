const Camp = require("../model/CampSchema");

const deleteCamp = async (req, res) => {
    const { campId } = req.query;
    const organiserId = req.Id;
    try {
        const camp = await Camp.findById(campId);

        if (!camp) {
            return res.status(404).json({ message: 'Camp not found' });
        }

        if (camp.organiserId != organiserId) {
            return res.status(403).json({ message: 'You are not authorized to delete this camp' });
        }

        await Camp.findByIdAndDelete(campId);
        res.status(200).json({ message: 'Camp deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const campControllerApi = async (req, res) => {
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

const sendCampRequest = async (req, res) => {
    const { campName, campAddress, startDate, endDate, location } = req.body;
    const organiserId = req.Id;

    if (!campName || !campAddress || !startDate || !endDate) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    try {
        const newCamp = await Camp.create({
            location: {
                type: 'Point',
                coordinates: [location.longitude, location.latitude] // GeoJSON format: [lng, lat]
            },
            organiserId,
            campName,
            campAddress,
            startDate,
            endDate,
            deleteAt: endDate,
        });

        res.status(201).json({ message: 'Camp details saved successfully!', newCamp });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const getUserCamps = async (req, res) => {
    const userId = req.Id;
    try {
        const camps = await Camp.find({ organiserId: userId })
        res.status(200).json({ camps })
    } catch (error) {
        res.status(500).json({ message: 'Server error ', error: error.message });
    }
}

// const getCamps = async (req, res) => {
//     try {
//         const { location } = req.query;
//         console.log(location)
//         const camps = await Camp.find()
//         res.status(200).json(camps)
//     } catch (error) {
//         res.status(500).json({ message: 'Server error ', error: error.message });
//     }
// }




module.exports = {
    deleteCamp, sendCampRequest, getUserCamps,campControllerApi
};