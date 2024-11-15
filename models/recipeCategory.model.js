const {Schema, model} = require('mongoose');

const recipeCategorySchema = new Schema({
    name: {
        type:String,
        required: [true, 'Category name is required'],
        unique: true
    },
    isDeleted:{
        type:Boolean,
        default: false,
    }
}, {timestamps: true})

module.exports = model('RecipeCategory', recipeCategorySchema)