const express = require('express');
const router = express.Router({mergeParams:true});

const userRouter = require('./userRouters');

// using nested routers allows better organization
router.use(userRouter);

module.exports = router;