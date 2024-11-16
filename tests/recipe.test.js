const User = require("../models/user.model")
const Recipe = require("../models/recipe.model")
const {connect, disconnect} = require('../config/db');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../app');
let token;
let userID
let recipes;
let specialIngredient;
let cat;


// runs this code before every other test
beforeAll(async () => {
    await connect();
    let user = await User.findOne({
        email: "admin@admin.com"
    })
    token = jwt.sign({
        email: user.email,
        name: user.name,
        password: user.password,
        _id: user._id
    },process.env.JWT_SECRET);
});
// runs this after all each
afterAll(async () => {
    await disconnect();
})

describe('Get all Recipes', () => {
    test('Should retrieve an array of Recipes', async () => {
       
        // supertest coming in
        const res = await request(app).get('/api/recipes')
        // console.log(res.body)
        recipes = res.body.recipes;
        specialIngredient = res.body[1].ingredients[0].ingredient
        console.log(specialIngredient)
        cat = res.body[2].category
        // console.log(ingredient)
        // console.log(users)
        expect(res.statusCode).toEqual(200);
    })
});
// couldnt get ingredients to come back as one even there was one in the array. It goes in within the console log but doesnt save ???
describe('Creating a recipe', () => {
    test('Should be able to create a recipe', async () => {
        const newRecipe = {
            title: 'Spaghetti Bolognese',
            ingredients: [{ingredient:specialIngredient},{quantity:3}],
            instructions: 'Boil and cook easy',
            category:cat,
            cooking_time:"2 mins",
            description:"very good, very nice"
          };
      
        // supertest coming in
        const res = await request(app).post('/api/recipes').set('Authorization',`Bearer ${token}`).send(newRecipe).set('Accept', 'application/json')
        // console.log(res.body)
        const recipeInDb = await Recipe.findById(res.body.recipe._id);
        // const validIng = res.body.recipe.ingredients[0].quantity
        // console.log(users)
        expect(recipeInDb).toBeTruthy();
        expect(res.body.recipe.ingredients.length).toBe(1);
        // expect(validIng).toBe(`${specialIngredient.quantity}`)
    })
});