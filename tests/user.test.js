const User = require("../models/user.model")
const {connect, disconnect} = require('../config/db');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../app');
let token;
let users;

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

describe('Get all Users', () => {
    test('Should retrieve an array of Users', async () => {
       
        // supertest coming in
        const res = await request(app).get('/api/users/all').set('Authorization',`Bearer ${token}`)
        // console.log(res.body)
        users = res.body.users[0]._id;
        // console.log(users)
        expect(res.statusCode).toEqual(200);
    })
})
describe('Get a single user', () => {
    test('Should retrieve a singular user', async () => {
        const res = await request(app).get(`/api/users/specific/${users}`).set('Authorization',`Bearer ${token}`)
        expect(res.statusCode).toEqual(200);
        expect(res.body.user.firstName).toEqual("Customer");
    })
})
describe('Get all recipes by user and add it to favourites', () => {
    test('Should retrieve an array of recipes created by user', async () => {
        // supertest coming in
        const res = await request(app).get('/api/users/myRecipes').set('Authorization',`Bearer ${token}`)
        recipes = res.body.recipes[0]._id;
        // console.log(recipes)
        expect(res.statusCode).toEqual(200);
    })
    test('add this recipe to favourites', async () => {
        const res = await request(app).post(`/api/users/favourites/${recipes}`).set('Authorization',`Bearer ${token}`)
        expect(res.statusCode).toEqual(200);
    })
})
