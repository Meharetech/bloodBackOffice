// dbConnection.jsx

const mongoose = require('mongoose');

const dbConnection = async () => {

    try {
        await mongoose.connect('mongodb+srv://meharetech420:hsRglchyifbiCf6a@cluster0.y7pmv.mongodb.net/Blood');
        console.log('Connected to database');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

module.exports = dbConnection;