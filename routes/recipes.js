const express = require('express');
const router = express.Router();

const{ 
    readAll,
    readOne,
    createData,
    updateData,
    deleteData,
    recipesByUser
    } = require('../controllers/recipe.controller')

    const {loginRequired} = require('../controllers/user.controller');
    
router.get('/', readAll);

router.get('/:id',loginRequired, readOne);
// all recipes by user
router.get('/myRecipes',loginRequired, recipesByUser);

router.post('/',loginRequired, createData);

router.put('/:id',loginRequired, updateData);

router.delete('/:id',loginRequired, deleteData);


module.exports = router;