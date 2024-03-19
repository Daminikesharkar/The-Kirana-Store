const express = require('express');

const homePageController = require('../controllers/home');

const router = express.Router();

router.get('/',homePageController.getIndexPage); //show home page html 
router.post('/signup',homePageController.postUser); //signUp user route
router.post('/login',homePageController.loginUser); //login user route

module.exports = router;