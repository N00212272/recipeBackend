const mongoose = require('mongoose');
const url = process.env.DB_ATLAS_URL


const init = () => {
    mongoose.set('debug', true);
    mongoose.connect(url)
    .catch(err => {
        console.log(`Error: ${err.stack}`);
    });
    mongoose.connection.on('open', () => {
        console.log('Connected to db');
    })
};

module.exports = init;