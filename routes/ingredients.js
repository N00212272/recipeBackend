const express = require('express');
const router = express.Router();

const{ 
    readAll,
    readOne,
    createData,
    updateData,
    deleteData
    } = require('../controllers/ingredient.controller')

    const {loginRequired, hasRole} = require('../middleware/auth.middleware');

    const imageUpload = require("../config/imageUpload")

router.get('/', readAll);

router.get('/:id', readOne);

router.post('/',loginRequired, hasRole("admin"), imageUpload.single('image'),createData);

router.put('/:id',loginRequired, updateData);

router.patch('/:id',loginRequired, deleteData);


module.exports = router;