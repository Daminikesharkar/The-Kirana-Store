const express = require('express');

const premiumController = require('../controllers/premium');
const middleware = require('../middleware/authentication');

const router = express.Router();

router.get('/premium',premiumController.displayPremiumPage);
router.get('/buyPremium',middleware.authenticate,premiumController.buyPremium);
router.post('/updateTransaction',middleware.authenticate,premiumController.updateTransaction);

router.get('/leaderboard',middleware.authenticate,premiumController.showLeaderboard);

module.exports = router;