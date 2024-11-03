const Ingredient = require('../models/ingredient.model');
const IngredientCategory = require('../models/ingredientCategory.model');
const Unit = require('../models/unit.model');

const seedIngredients = async () => {
    const categories = await IngredientCategory.find();
    const units = await Unit.find();

    const ingredients = [
        {
            name: 'Tomato',
            calories: 18,
            category_id: categories.find(cat => cat.name === 'Vegetables')._id,
            unit_id: units.find(unit => unit.name === 'Gram')._id
        },
        {
            name: 'Chicken Breast',
            calories: 165,
            category_id: categories.find(cat => cat.name === 'Poultry')._id,
            unit_id: units.find(unit => unit.name === 'Gram')._id
        },
        {
            name: 'Rice',
            calories: 130,
            category_id: categories.find(cat => cat.name === 'Grains')._id,
            unit_id: units.find(unit => unit.name === 'Cup')._id
        },
        {
            name: 'Olive Oil',
            calories: 119,
            category_id: categories.find(cat => cat.name === 'Oils')._id,
            unit_id: units.find(unit => unit.name === 'Tablespoon')._id
        },
        {
            name: 'Cheddar Cheese',
            calories: 402,
            category_id: categories.find(cat => cat.name === 'Dairy')._id,
            unit_id: units.find(unit => unit.name === 'Gram')._id
        },
        {
            name: 'Spinach',
            calories: 23,
            category_id: categories.find(cat => cat.name === 'Vegetables')._id,
            unit_id: units.find(unit => unit.name === 'Gram')._id
        },
        {
            name: 'Salmon',
            calories: 206,
            category_id: categories.find(cat => cat.name === 'Seafood')._id,
            unit_id: units.find(unit => unit.name === 'Gram')._id
        }
    ];

    await Ingredient.insertMany(ingredients);
    console.log('Ingredients seeded.');
};

module.exports = seedIngredients;
