const express = require('express');
const router = express.Router();

const{ 
    readAll,
    readOne,
    createData,
    updateData,
    deleteData,
    submitCreate
    } = require('../controllers/recipe.controller')

    const {loginRequired,ownsRecipe,addRecipeToUser} = require('../middleware/auth.middleware');
    
router.get('/', readAll);

router.get('/:id',loginRequired, readOne);

router.post('/',loginRequired, createData,addRecipeToUser,submitCreate);
// added middleware to check if id matches the recipe id
router.put('/:id',loginRequired,ownsRecipe, updateData);

router.delete('/:id',loginRequired,ownsRecipe, deleteData);


module.exports = router;