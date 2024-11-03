const mongoose = require('mongoose');
const init = require('../config/db'); 
const seedRoles = require('./roleSeed');
const usersSeed = require('./userSeed');
const seedIngredientCategories = require('./ingredientCategorySeed');
const seedRecipeCategories = require('./recipeCategorySeed');
const seedUnits = require('./unitSeed');
const seedIngredients = require('./ingredientSeed');
const seedRecipes = require('./recipeSeed');

const dropAllCollections = async () => {
    // gets a list of all collections in the db and puts into an array
    const collections = await mongoose.connection.db.listCollections().toArray();
    // loop to go through each connection and drop all values within the collections
    for (const collection of collections) {
        await mongoose.connection.db.collection(collection.name).deleteMany({});
        console.log(`Dropped collection: ${collection.name}`);
    }
};


const runSeeders = async () => {
    try {
        // order of seeders. If the order is not correct an error will occur
         await init(); 
         console.log("connected");
        await dropAllCollections();
        console.log("dropped");
        await seedRoles(); 
        console.log("Roles seeding completed.");

        await usersSeed(); 
        console.log("Users seeding completed.");

        await seedIngredientCategories(); 
        console.log("Ingredient categories seeding completed.");

        await seedRecipeCategories(); 
        console.log("Recipe categories seeding completed.");

        await seedUnits(); 
        console.log("Units seeding completed.");

        await seedIngredients(); 
        console.log("Ingredients seeding completed.");
        // 10 recipes will be created
        await seedRecipes(10); 
        console.log("Recipes seeding completed.");
    } catch (error) {
        console.error("Error during seeding:", error);
    } finally {
        await mongoose.connection.close(); 
        console.log('Database connection closed');
        process.exit();
    }
};

runSeeders();
