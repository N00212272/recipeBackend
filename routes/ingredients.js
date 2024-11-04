const express = require('express');
const router = express.Router();

const{ 
    readAll,
    readOne,
    createData,
    updateData,
    deleteData
    } = require('../controllers/ingredient.controller')

    const {loginRequired, hasRole} = require('../controllers/user.controller');

router.get('/', readAll);

router.get('/:id', readOne);

router.post('/',loginRequired, hasRole("admin"), createData);

router.put('/:id',loginRequired, updateData);

router.delete('/:id',loginRequired, deleteData);


module.exports = router;