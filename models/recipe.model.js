const {Schema, model} = require('mongoose');

const recipeSchema = new Schema({
    title: {
        type:String,
        required: [true, 'Title field is required']
    },
    description: {
        type:String,
        required: [true, 'desciption field is required']
    },
    cooking_time: {
        type:Number,
        required: [true, 'cooking time field is required']
    },
    instructions: {
        type:String,
        required: [true, 'instructions field is required']
    },
    // fks
    category:{
        type: Schema.Types.ObjectId,
        ref:'RecipeCategory',
        required:[true, 'Category is required']
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required:[true, 'User is required']
    },
    //many to many relationship uses []
    ingredients: [{
        ingredient:{
            type: Schema.Types.ObjectId,
            ref:'Ingredient',
            required:[true, 'Ingredient is required'] 
        },
        quantity: {
            type:Number,
            required: [true, 'Ingredient quantity is required']
        }
        
    }],
    image_path:{
        type:String
    },
    isDeleted:{
        type:Boolean,
        default: false,
    }
}, {timestamps:true});

// Had to add this to stop mongoose from adding an subdocument id to my column within ingredients
recipeSchema.path('ingredients').schema.set('_id', false);

module.exports = model('Recipe', recipeSchema)