const express = require('express');

const homePageController = require('../controllers/home');

const router = express.Router();

router.get('/',homePageController.getIndexPage);

module.exports = router;