const express = require('express');
const router = express.Router();

const{ 
    readAll,
    readOne,
    createData,
    updateData,
    deleteData
    } = require('../controllers/ingredient.controller')

router.get('/', readAll);

router.get('/:id', readOne);

router.post('/', createData);

router.put('/:id', updateData);

router.delete('/:id', deleteData);


module.exports = router;