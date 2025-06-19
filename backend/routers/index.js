const express = require('express');
const router = express.Router();

const userRouter = require('./userRouters');
const loginRouter = require('././loginRouters');
const candidateRouter = require('././candidateRouters');
const jobRouter = require('././jobFormRouters');

router.use("/user", userRouter);
router.use("/login", loginRouter)
router.use("/candidates", candidateRouter);  
router.use("/jobs", jobRouter);


module.exports = router;