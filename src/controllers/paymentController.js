const Payment = require("../models/Payment");
const Organization = require("../models/Organization");

// Create Payment (Admin Only)
const createPayment = async (req, res) => {
    try {
        const { organizationId, amount, method, status, transactionId } = req.body;

        // Check if the organization exists
        const organization = await Organization.findByPk(organizationId);
        if (!organization) return res.status(404).json({ message: "Organization not found" });

        const payment = await Payment.create({
            organizationId,
            amount,
            method,
            status: status || "pending",
            transactionId
        });

        res.status(201).json({ message: "Payment recorded", payment });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get All Payments (Admin Only)
const getPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get Payment by ID
const getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findByPk(id);
        if (!payment) return res.status(404).json({ message: "Payment not found" });

        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Update Payment Status
const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        let payment = await Payment.findByPk(id);
        if (!payment) return res.status(404).json({ message: "Payment not found" });

        payment.status = status || payment.status;
        await payment.save();

        res.json({ message: "Payment status updated", payment });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete Payment
const deletePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findByPk(id);
        if (!payment) return res.status(404).json({ message: "Payment not found" });

        await payment.destroy();
        res.json({ message: "Payment deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { createPayment, getPayments, getPaymentById, updatePaymentStatus, deletePayment };
