const express = require('express');

const userStoreController = require('../controllers/userStore');
const middleware = require('../middleware/authentication');

const router = express.Router();

router.get('/userStore',userStoreController.displayUserStorePage);
router.post('/addProducts',middleware.authenticate,userStoreController.addProducts);
router.get('/getAllProducts',middleware.authenticate,userStoreController.getAllProducts);
router.get('/deleteProduct/:id',middleware.authenticate,userStoreController.deleteProduct);

module.exports = router;