const mongoose = require('mongoose');
require('dotenv').config()
const url = process.env.DB_ATLAS_URL


const init = async () => {
    mongoose.set('debug', true); // Enable mongoose debug mode for verbose logging
    
    try {
        await mongoose.connect(url); // Attempt to connect to the database
        console.log('Connected to db'); // Log on successful connection
    } catch (err) {
        console.error(`Error during database connection: ${err.message}`); // Log connection error messages
        throw err; // Rethrow the error to be handled by the calling function
    }
};

module.exports = init;