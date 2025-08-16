var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')

/* GET home page. */
router.get('/getAllUsers',userController.getAllUsers )
router.get('/getUserById/:id',userController.getUserById )

module.exports = router;
