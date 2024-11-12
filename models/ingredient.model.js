const {Schema, model} = require('mongoose');

const ingredientSchema = new Schema({
    name: {
        type:String,
        required: [true, 'Name field is required'],
        unique:true
    },
    calories: {
        type:Number,
        required: [true, 'calories is required']
    },
    
    // fks
    category_id:{
        type: Schema.Types.ObjectId,
        ref:'IngredientCategory',
        required:[true, 'Category is required']
    },
    unit_id:{
        type: Schema.Types.ObjectId,
        ref:'Unit',
        required:[true, 'Unit is required']
    },
    recipes: [{
        type: Schema.Types.ObjectId,
        ref: 'Recipe'
    }],
}, {timestamps:true});

module.exports = model('Ingredient', ingredientSchema)