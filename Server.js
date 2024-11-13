const express = require('express');
const cors = require('cors');
const { addUser, verifyOtp, loginUser, verifyToken, getBloodRequests, sendBloodRequests, getUserRequests, donatersDetail, approveDonation, userProfileDetails, deleteBloodRequest, forgetPasswordOtp, userControllerApi, sendEmergencyBloodRequests, verifyEmeregencyOtp, checkEmergencyBloodRequest, resendOtp } = require('./controller/UserController')
const dbConnection = require('./dbConnection');
const cron = require('node-cron');
const { rateLimit } = require('express-rate-limit')
const { addDonorsToTheRequest, getDonorsResponses, uploadUserImage, donationsControllerApi, getUserImage } = require('./controller/DonationsController');
const { adminVerifyToken, deleteUser, deleteHospital, approveStatus, approveHospital, pendingUsers, loginAdmin, userDetails, HospitalDetails, getDonorsResponsesAdmin, getHospitalDonorsResponsesAdmin, setNewEvent, getEvents, deleteEvent, deleteBloodRequestAdmin, adminUserControllerApi } = require('./controller/AdminController');
const { sendCampRequest, deleteCamp, getUserCamps } = require('./controller/CampController');
const { createBanner, getAllBanners, deleteBanner, bannerControllerApi } = require('./controller/BannerController');


const {
    signupHospital,
    loginHospital,
    HospitalverifyToken,
    deleteHospitalBloodRequest,
    sendBloodRequestsHospital,
    getHospitalRequests,
    approveHospitalDonation,
    getHospitalDonorsResponses,
    addDonorsToTheHospitalRequest,
    hospitlDonationDetail,
    hospitalProfileDetails,
    getBloodRequestsHospital,
    getNgoMembers,
    hospitalControllerApi,
    updateHospitalProfileDetails
} = require('./controller/HospitalController');
const { deleteImage, generateSignature, updateImage, getImages, adminControllerApi } = require('./controller/AdminImageController');
const { registerVehicle, getVehicleByPincode } = require('./controller/VehicleController');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

const app = express();
const PORT = 7000;

dbConnection();

app.use(cors());
app.use(express.json());

app.post('/addUser',
    addUser
);

app.post('/verifyOtp',
    verifyOtp
)

app.post('/resendOtp',
    resendOtp
)

app.post('/forgetPassword',
    forgetPasswordOtp
)

app.post('/loginUser',
    loginUser
);

app.get('/profileDetails',
    verifyToken,
    userProfileDetails
)

app.get('/usersignature',
    verifyToken,
    generateSignature
)
app.post('/uploadUserImage', verifyToken, uploadUserImage)
app.get('/getUserImage', verifyToken, getUserImage)

app.get('/getLocation',
    verifyToken,
    getBloodRequests
);

app.delete("/userHandler", adminControllerApi)

app.post('/sendBloodRequest',
    verifyToken,
    sendBloodRequests
);

app.post('/sendEmergencyBloodRequest',
    sendEmergencyBloodRequests
);
app.post('/verifyEmergencyOtp',
    verifyEmeregencyOtp
);
app.get('/checkEmergencyBloodRequest',
    checkEmergencyBloodRequest
);

app.delete('/deleteBloodRequestUser',
    verifyToken,
    deleteBloodRequest
)

app.get('/getUploadedRequest',
    verifyToken,
    getUserRequests
);

app.get('/donatersDetail',
    verifyToken,
    donatersDetail
);

app.post('/addDonorToTheRequest',
    verifyToken,
    addDonorsToTheRequest
);

app.get('/getDonorsResponses',
    verifyToken,
    getDonorsResponses
);

app.post('/addCamp',
    verifyToken,
    sendCampRequest
);

app.get('/getUserCamps',
    verifyToken,
    getUserCamps
);

app.delete('/deleteCamp',
    verifyToken,
    deleteCamp
);

app.post('/approveDonation',
    verifyToken,
    approveDonation
);

app.get('/getDonorsResponsesAdmin',
    adminVerifyToken,
    getDonorsResponsesAdmin
);

app.delete("/adminHandler",
    userControllerApi
)

app.post('/adminLogin',
    loginAdmin
);

app.delete('/reject-user',
    adminVerifyToken,
    deleteUser
);

app.delete('/deleteBloodRequestAdmin',
    adminVerifyToken,
    deleteBloodRequestAdmin
)

app.put('/approve-user',
    adminVerifyToken,
    approveStatus
);

app.get('/pending-users',
    adminVerifyToken,
    pendingUsers
);

app.get('/userDetails',
    adminVerifyToken,
    userDetails
);

app.get('/getHospitalDonorsResponsesAdmin',
    adminVerifyToken,
    getHospitalDonorsResponsesAdmin
);

app.delete("/adminUserHandler",
    adminUserControllerApi
)


app.delete('/reject-hospital',
    adminVerifyToken,
    deleteHospital
);

app.put('/approve-hospital',
    adminVerifyToken,
    approveHospital
);

app.get('/hospital-details',
    adminVerifyToken,
    HospitalDetails
)

app.post('/setNewEvent',
    adminVerifyToken,
    setNewEvent
)

app.post('/createBanner', adminVerifyToken, createBanner)
app.get('/getAllBanners', getAllBanners)
app.delete('/deleteBanner', adminVerifyToken, deleteBanner)

app.get('/getEvents',
    getEvents
)

app.delete('/deleteEvent',
    adminVerifyToken,
    deleteEvent
)

app.post('/hospitalSignup',
    signupHospital
)
app.post('/loginHospital',
    loginHospital
)

app.delete('/deleteHospitalBloodRequest',
    HospitalverifyToken,
    deleteHospitalBloodRequest
);

app.post('/sendBloodRequestHospital',
    HospitalverifyToken,
    sendBloodRequestsHospital
);

app.get('/getHospitalRequests',
    HospitalverifyToken,
    getHospitalRequests
);

app.get('/getHospitalDonorsResponses',
    HospitalverifyToken,
    getHospitalDonorsResponses
);

app.delete("/hospitalHandler",
    hospitalControllerApi
)

app.post('/addDonorToTheHospitalRequest',
    verifyToken,
    addDonorsToTheHospitalRequest
);

app.delete("/bannerHandler",
    bannerControllerApi
)

app.delete("/donationHandler",
    donationsControllerApi
)

app.post('/approveHospitalDonation',
    HospitalverifyToken,
    approveHospitalDonation
);

app.get('/hospitlDonationDetail',
    verifyToken,
    hospitlDonationDetail
);

app.get('/hospitalProfileDetails',
    HospitalverifyToken,
    hospitalProfileDetails
)

app.put('/updateHospitalProfileDetails', HospitalverifyToken, updateHospitalProfileDetails)
app.get('/getNgoMembers', HospitalverifyToken, getNgoMembers)

app.get('/getAllHospitalRequests', getBloodRequestsHospital)

app.post('/deleteImage',
    adminVerifyToken,
    deleteImage
)

app.get('/signature',
    adminVerifyToken,
    generateSignature
)

app.put('/updateImage',
    adminVerifyToken,
    updateImage
)

app.get('/getImages',
    getImages
)

app.post('/registerVehicle', registerVehicle);
app.get('/getVehiclesByPincode', getVehicleByPincode)

cron.schedule('0 0 */4 * *', () => {
    checkDonationEligibility();
});


app.listen(PORT, (error) => {
    if (!error) {
        console.log('Server is running successfully on port ' + PORT);
    } else {
        console.error('Error occurred, server cannot start: ' + error);
    }
});
