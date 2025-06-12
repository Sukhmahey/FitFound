const express = require('express');
const router = express.Router();

// import the controller
const userController = require('../controllers/UserController');

// POST: /user
router.post("/", userController.saveUser);

// Export the router
module.exports = router; 