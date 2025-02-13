const express = require("express");
const {
    createSubscription,
    getSubscriptions,
    getSubscriptionByOrg,
    checkSubscriptionStatus,
    cancelSubscription
} = require("../controllers/subscriptionController");

const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createSubscription);
router.get("/", authMiddleware, adminMiddleware, getSubscriptions);
router.get("/:organizationId", authMiddleware, getSubscriptionByOrg);
router.get("/validate/:organizationId", authMiddleware, checkSubscriptionStatus);
router.put("/cancel/:organizationId", authMiddleware, adminMiddleware, cancelSubscription);

module.exports = router;
