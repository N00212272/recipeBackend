const express = require('express');
const router = express.Router();
const { loginRequired, hasRole } = require('../middleware/auth.middleware');
const { 
    register, 
    login, 
    registerAdmin, 
    updatePassword 
} = require('../controllers/auth.controller');
const { 
    getAllUsers,
    getUserById, 
    getUserRecipes, 
    addFavourite, 
    removeFavourite, 
    getFavourites 
} = require('../controllers/user.controller');

// Authentication Routes
router.post('/register', register); 
router.post('/login', login);
router.put('/updatePassword', loginRequired, updatePassword);

// User Routes
router.get('/specific/:userId', loginRequired,getUserById ); 
router.get('/all', loginRequired,getAllUsers ); 
router.get('/myRecipes', loginRequired, getUserRecipes); 

// Favourites Routes
router.post('/favourites/:recipeId', loginRequired, addFavourite); 
router.delete('/favourites/:recipeId', loginRequired, removeFavourite); 
router.get('/favourites', loginRequired, getFavourites); 

// Admin Routes
router.post('/register/admin', loginRequired, hasRole("admin"), registerAdmin); 

module.exports = router;
