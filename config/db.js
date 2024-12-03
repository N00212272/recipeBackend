const mongoose = require('mongoose');
require('dotenv').config();
let db;


const connect = async () => {
    db = null;

    try {
        mongoose.set('strictQuery', false);

        let db_url = process.env.DB_ATLAS_URL

        if(process.env.ENVIROMENT === 'testing'){
            await mongoose.connect(process.env.TEST_DB_ATLAS_URL);
        }
        await mongoose.connect(db_url);
      

        console.log('Connected successfully to db');
        db = mongoose.connection;
    } catch (error) {
        console.log(error);
    } finally {
        // if (db !== null && db.readyState === 1) {
        //     await db.close();
        //     console.log("Disconnected successfully from db");
        // }
    }
};

const disconnect = async () => {
    await db.close();
};

module.exports = { connect, disconnect };
