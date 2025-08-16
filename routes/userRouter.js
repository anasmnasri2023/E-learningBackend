var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const uploadfile = require('../middlewares/uploadFile')
/* GET home page. */
router.get('/getAllUsers',userController.getAllUsers )
router.get('/getOrderUsersByAge',userController.getOrderUsersByAge )
router.get('/searchUsersByUsername',userController.searchUsersByName )
router.get('/getUserByAgeBetweenXAndY',userController.getUserByAgeBetweenXAndY )
router.get('/getUserByAge/:age',userController.getUserByAge )
router.get('/getUserById/:id',userController.getUserById )
router.post('/addClient',userController.addClient )
router.post('/addClientWithFile',uploadfile.single("image_User"),userController.addClientWithFile )
router.post('/addProf',userController.addProf )
router.delete('/DeleteUserById/:id',userController.DeleteUserById )

module.exports = router;
