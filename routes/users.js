const express = require('express');
const router = express.Router();

const{ 
    register,
    login,
    loginRequired,
    addFavourite,
    removeFavourite,
    hasRole,
    registerAdmin,
    updatePassword
    } = require('../controllers/user.controller')

router.post('/register', register);

router.post('/login', login);
// favourites
router.post('/favourite/:recipeId', loginRequired, addFavourite);
router.delete('/favourite/:recipeId', loginRequired, removeFavourite);
// register new admins
router.post('/register/admin',loginRequired, hasRole("admin"),registerAdmin);
// update password
router.put('/updatePassword',loginRequired,updatePassword);


module.exports = router;