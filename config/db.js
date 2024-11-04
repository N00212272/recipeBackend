const mongoose = require('mongoose');
require('dotenv').config()
const url = process.env.DB_ATLAS_URL


const init = async () => {
    mongoose.set('debug', true);
    
    try {
        await mongoose.connect(url); 
        console.log('Connected to db'); 
    } catch (err) {
        console.error(`Error during database connection: ${err.message}`); 
        throw err;
    }
};

module.exports = init;