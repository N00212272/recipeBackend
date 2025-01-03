const express = require('express');
const router = express.Router();

const{ 
    readAll,
    readOne,
    createData,
    updateData,
    deleteData
    } = require('../controllers/unit.controller')

    const {loginRequired, hasRole} = require('../middleware/auth.middleware');
    
router.get('/', readAll);

router.get('/:id',loginRequired,hasRole("admin"), readOne);

router.post('/',loginRequired,hasRole("admin"), createData);

router.put('/:id',loginRequired,hasRole("admin"), updateData);

router.patch('/:id',loginRequired,hasRole("admin"), deleteData);


module.exports = router;