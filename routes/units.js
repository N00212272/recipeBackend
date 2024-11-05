const express = require('express');
const router = express.Router();

const{ 
    readAll,
    readOne,
    createData,
    updateData,
    deleteData
    } = require('../controllers/unit.controller')

    const {loginRequired, hasRole} = require('../controllers/user.controller');
    
router.get('/', readAll);

router.get('/:id',loginRequired,hasRole("admin"), readOne);

router.post('/',loginRequired,hasRole("admin"), createData);

router.put('/:id',loginRequired,hasRole("admin"), updateData);

router.delete('/:id',loginRequired,hasRole("admin"), deleteData);


module.exports = router;