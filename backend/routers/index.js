// backend/routers/mainRouter.js
const express = require("express");
const router = express.Router();

const userRouter = require("./userRouters");
const loginRouter = require("./loginRouters");
const candidateRouter = require("./candidateRouters");
const jobRouter = require("./jobFormRouters");
const employerProfileRouter = require("./employerProfileRouters"); 
const interactionRoutes = require("./interactionRouters");
const verificationRequestRouter = require("./verificationRequestRouters"); 
const notificationRouters = require("./notificationRouters")

router.use("/user", userRouter);
router.use("/login", loginRouter);
router.use("/candidates", candidateRouter);
router.use("/jobs", jobRouter);
router.use("/employers", employerProfileRouter);

router.use("/interactions", interactionRoutes);
router.use("/verification-requests", verificationRequestRouter);
router.use("/notifications", notificationRouters);

module.exports = router;
