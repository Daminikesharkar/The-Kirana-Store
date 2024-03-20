const express = require('express');

const userStoreController = require('../controllers/userStore');

const router = express.Router();

router.get('/userStore',userStoreController.displayUserStorePage);
router.post('/addProducts',userStoreController.addProducts);
router.get('/getAllProducts',userStoreController.getAllProducts);

module.exports = router;