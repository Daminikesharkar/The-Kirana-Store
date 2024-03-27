const express = require('express');

const historyController = require('../controllers/history');
const middleware = require('../middleware/authentication');

const router = express.Router();

router.get('/history',historyController.displayHistoryPage);
router.get('/downloadFile',middleware.authenticate,historyController.downloadFile);
router.get('/downloadHistory',middleware.authenticate,historyController.downloadedHistory);
router.get('/getWeeklyData',middleware.authenticate,historyController.showWeeklyData);

module.exports = router;