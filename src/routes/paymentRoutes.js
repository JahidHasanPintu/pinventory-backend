const express = require("express");
const {
    createPayment,
    getPayments,
    getPaymentById,
    updatePaymentStatus,
    deletePayment
} = require("../controllers/paymentController");

const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createPayment);
router.get("/", authMiddleware, adminMiddleware, getPayments);
router.get("/:id", authMiddleware, adminMiddleware, getPaymentById);
router.put("/:id", authMiddleware, adminMiddleware, updatePaymentStatus);
router.delete("/:id", authMiddleware, adminMiddleware, deletePayment);

module.exports = router;
