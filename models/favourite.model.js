const {Schema, model} = require('mongoose');

const favouriteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref:'User',
        required:[true, 'User is required']
    },
    recipe: {
        type: Schema.Types.ObjectId,
        ref:'Recipe',
        required:[true, 'Recipe is required']
    }
}, {timestamps:true});

module.exports = model('Favourite', favouriteSchema)