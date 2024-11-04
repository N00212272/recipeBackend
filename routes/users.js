const express = require('express');
const router = express.Router();

const{ 
    register,
    login,
    loginRequired,
    addFavourite,
    removeFavourite
    } = require('../controllers/user.controller')

router.post('/register', register);

router.post('/login', login);
// favourites
router.post('/favourite/:recipeId', loginRequired, addFavourite);
router.delete('/favourite/:recipeId', loginRequired, removeFavourite);


module.exports = router;