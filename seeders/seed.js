const {connect,disconnect} = require('../config/db'); 
const seedRoles = require('./roleSeed');
const usersSeed = require('./userSeed');
const seedIngredientCategories = require('./ingredientCategorySeed');
const seedRecipeCategories = require('./recipeCategorySeed');
const seedUnits = require('./unitSeed');
const seedIngredients = require('./ingredientSeed');
const seedRecipes = require('./recipeSeed');

// const dropAllCollections = async () => {
//     // gets a list of all collections in the db and puts into an array
//     const collections = await connect.db.listCollections().toArray();
//     // loop to go through each connection and drop all values within the collections
//     for (const collection of collections) {
//         await connect.db.collection(collection.name).deleteMany({});
//         console.log(`Dropped collection: ${collection.name}`);
//     }
// };


const runSeeders = async () => {
    try {
        // order of seeders. If the order is not correct an error will occur
         await connect(); 
         console.log("connected");
        // await dropAllCollections();
        // console.log("dropped");
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
    } 
};

runSeeders().then(()=>{
    disconnect()
    console.log('Database connection closed');
});
