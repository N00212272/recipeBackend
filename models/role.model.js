const {Schema, model} = require('mongoose');

const roleSchema = new Schema({
    name: {
        type:String,
        required: [true, 'Rp;e name is required'],
        unique: true
    }
}, {timestamps: true})

module.exports = model('Role', roleSchema)