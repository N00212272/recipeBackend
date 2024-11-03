const {Schema, model} = require('mongoose');

const unitSchema = new Schema({
    name: {
        type:String,
        required: [true, 'Unit name is required'],
        unique: true
    },
    abbreviation: {
        type: String,
        required: [true, 'Unit abbreviation is required'],
        unique: true
    }
}, {timestamps: true})

module.exports = model('Unit', unitSchema)