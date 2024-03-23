const express = require('express');

const forgetPasswordController = require('../controllers/forgetPassword');

const passwordController = require('../controllers/password');

const router = express.Router();

// router.get('/forgetPasswordpage',forgetPasswordController.getforgetPasswordPage);
// router.post('/forgetPassword',forgetPasswordController.getEmailToSendResetLink);

router.get('/forgetPasswordpage',passwordController.getforgetPasswordPage);
router.post('/forgetPassword',passwordController.getEmailToSendResetLink);

module.exports = router;