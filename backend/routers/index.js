const express = require('express');
const router = express.Router();

const userRouter = require('./userRouters');
const loginRouter = require('././loginRouters');

router.use("/user", userRouter);
router.use("/login", loginRouter)

module.exports = router;