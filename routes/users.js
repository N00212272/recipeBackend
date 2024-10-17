const express = require('express');
const router = express.Router();

const{ 
    register,
    login,
    loginRequired
    } = require('../controllers/user.controller')

router.post('/register', register);

router.post('/login', login);



module.exports = router;