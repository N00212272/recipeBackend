const express = require('express');
const router = express.Router();

const{ 
    readAll,
    readOne,
    createData,
    updateData,
    deleteData,
    // submitCreate
    } = require('../controllers/recipe.controller')

    const {loginRequired,ownsRecipe} = require('../middleware/auth.middleware');

    const imageUpload = require("../config/imageUpload")
    
router.get('/', readAll);

router.get('/:id',loginRequired, readOne);

router.post('/',loginRequired,imageUpload.single('image'),createData);
// added middleware to check if id matches the recipe id
router.put('/:id',loginRequired,ownsRecipe,imageUpload.single('image'), updateData);

router.delete('/:id',loginRequired,ownsRecipe, deleteData);


module.exports = router;