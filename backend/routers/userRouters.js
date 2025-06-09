const express = require('express');
const router = express.Router();

// import the controller, make sure it is exported
const userController = require('../controllers/UserController');

// POST: /user
router.post("/user", userController.saveUser);

// Export the router
module.exports = router; 