const {faker} = require('@faker-js/faker')
const Recipe = require('../models/recipe.model');
const RecipeCategory = require('../models/recipeCategory.model');
const User = require('../models/user.model');
const Ingredient = require('../models/ingredient.model');
const Unit = require('../models/unit.model');
// decided to make it so it creates
const seedRecipes = async (count) => {
    await Recipe.deleteMany();
    // Brought in all models with relations to recipes
    const categories = await RecipeCategory.find();
    const users = await User.find();
    const ingredients = await Ingredient.find();
    const units = await Unit.find();

    const recipes = [];
    // nested loop
    // first loops through the count which is defined in the seed.js 
    for (let i = 0; i < count; i++) {
        const recipeIngredients = [];
        // using math.random function to give a random number of ingredients between 1 and 5. Math.floor rounds down so i needed to add 1 just incase the floating number is anything below 0.5.Which makes the number min 1.
        const numberOfIngredients = Math.floor(Math.random() * 5) + 1; 
        // second loop to loop through the number of ingredients and places random ingredients and units. 
        for (let j = 0; j < numberOfIngredients; j++) {
            const randomIngredient = ingredients[Math.floor(Math.random() * ingredients.length)];
            const randomUnit = units[Math.floor(Math.random() * units.length)];
            // need to push each recipe into the empty array which was defined before
            recipeIngredients.push({
                ingredient: randomIngredient._id,
                // random quantity from 1,10
                quantity: Math.floor(Math.random() * 10) + 1, 
                unit: randomUnit._id 
            });
        }

        const recipe = {
            title: faker.food.dish(),
            description: faker.lorem.sentences(2),
            // random cooking time
            cooking_time: `${Math.floor(Math.random() * 120) + 1} minutes`,
            instructions: faker.lorem.paragraph(),
            category: categories[Math.floor(Math.random() * categories.length)]._id,
            user: users[Math.floor(Math.random() * users.length)]._id,
            ingredients: recipeIngredients,
            image_path: "noImage.png"
        };

        recipes.push(recipe);
    }

    await Recipe.insertMany(recipes);
    console.log(`${count} recipes seeded.`);
};

module.exports = seedRecipes;
