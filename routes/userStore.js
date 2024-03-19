const express = require('express');

const userStoreController = require('../controllers/userStore');

const router = express.Router();

router.get('/userStore',userStoreController.displayUserStorePage);

module.exports = router;