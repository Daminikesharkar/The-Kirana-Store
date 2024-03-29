const express = require('express');

const premiumController = require('../controllers/premium');

const router = express.Router();

router.get('/premium',premiumController.displayPremiumPage);

module.exports = router;