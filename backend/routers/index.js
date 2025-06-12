const express = require('express');
const router = express.Router();

const userRouter = require('./userRouters');

// using nested routers allows better organization
router.use("/user", userRouter);

module.exports = router;