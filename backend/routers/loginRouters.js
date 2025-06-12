const express = require('express');
const router = express.Router();

// import the controller
const loginController = require('../controllers/LoginController');

// POST: /login
router.post("/", loginController.loginUser);

// Export the router
module.exports = router; 