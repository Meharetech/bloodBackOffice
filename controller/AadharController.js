const axios = require('axios');
const crypto = require('crypto');
const { KJUR, KEYUTIL, hextob64 } = require('jsrsasign'); // For handling digital signature

// UIDAI Public Key (Replace with actual public key)
const UIDAI_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
... your public key here ...
-----END PUBLIC KEY-----`;

// AES Encryption Function (For Aadhaar Number)
const encryptAadhaar = (aadhaarNumber) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.AES_KEY), process.env.AES_IV);
  let encrypted = cipher.update(aadhaarNumber.toString(), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

// Public Key Encryption (RSA)
const encryptWithPublicKey = (data) => {
  const publicKey = KEYUTIL.getKey(UIDAI_PUBLIC_KEY);
  const encryptedData = KJUR.crypto.Cipher.encrypt(data, publicKey, 'RSA');
  return hextob64(encryptedData);
};

// Step 1: Send OTP Request to UIDAI
const sendOtp = async (aadhaarNumber) => {
  const encryptedAadhaar = encryptAadhaar(aadhaarNumber);

  const response = await axios.post('https://uidai.gov.in/otp-request-endpoint', {
    uid: encryptedAadhaar,
    ac: 'AUA_CODE', // Your AUA Code
    sa: 'SUB_AUA_CODE', // Your Sub AUA Code
    ver: '2.5',
    txn: 'transaction-id',
    lk: process.env.LICENSE_KEY, // Your License Key
  });

  return response.data; // Should return a transaction ID (txn)
};

// Step 2: Validate OTP and Fetch eKYC Data
const validateOtpAndFetchEkyc = async (aadhaarNumber, otp, txnId) => {
  const encryptedAadhaar = encryptAadhaar(aadhaarNumber);

  // RSA Encrypt OTP
  const encryptedOtp = encryptWithPublicKey(otp);

  const response = await axios.post('https://uidai.gov.in/ekyc-endpoint', {
    uid: encryptedAadhaar,
    ac: 'AUA_CODE',
    sa: 'SUB_AUA_CODE',
    ver: '2.5',
    txn: txnId,
    otp: encryptedOtp,
    lk: process.env.LICENSE_KEY,
  });

  return response.data; // Should return the eKYC data
};

// Usage
(async () => {
  const aadhaarNumber = '123412341234'; // Test Aadhaar number
  const otp = '123456'; // OTP entered by the user

  try {
    // Step 1: Request OTP
    const otpResponse = await sendOtp(aadhaarNumber);
    console.log('OTP Response:', otpResponse);

    // Step 2: Validate OTP and Fetch eKYC Data
    const ekycData = await validateOtpAndFetchEkyc(aadhaarNumber, otp, otpResponse.txn);
    console.log('eKYC Data:', ekycData);

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
})();
