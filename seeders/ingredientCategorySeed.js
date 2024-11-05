const IngredientCategory = require('../models/ingredientCategory.model');

const seedIngredientCategories = async () => {
    await IngredientCategory.deleteMany();
    const categories = [
        { name: 'Vegetables' },
        { name: 'Fruits' },
        { name: 'Dairy' },
        { name: 'Meat' },
        { name: 'Grains' },
        { name: 'Spices' },
        { name: 'Poultry' },  
        { name: 'Seafood' },   
        { name: 'Herbs' },     
        { name: 'Nuts' },     
        { name: 'Oils' },
    ];

    await IngredientCategory.insertMany(categories);
    console.log('Ingredient categories seeded.');
};

module.exports = seedIngredientCategories;
