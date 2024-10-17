const {Schema, model} = require('mongoose');

const ingredientCategorySchema = new Schema({
    name: {
        type:String,
        required: [true, 'Category name is required'],
        unique: true
    }
}, {timestamps: true})

module.exports = model('IngredientCategory', ingredientCategorySchema)