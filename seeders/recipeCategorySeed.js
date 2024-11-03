// seeders/recipeCategorySeeder.js
const RecipeCategory = require('../models/recipeCategory.model');

const seedRecipeCategories = async () => {
    const categories = [
        { name: 'Appetizers' },
        { name: 'Main Courses' },
        { name: 'Desserts' },
        { name: 'Snacks' },
        { name: 'Beverages' },
    ];

    await RecipeCategory.insertMany(categories);
    console.log('Recipe categories seeded.');
};

module.exports = seedRecipeCategories;
