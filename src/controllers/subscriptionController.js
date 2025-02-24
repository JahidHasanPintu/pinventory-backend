const Subscription = require("../models/Subscription");
const Organization = require("../models/Organization");
const { Op } = require("sequelize");

// Create Subscription (Admin Only)
const createSubscription = async (req, res) => {
    try {
        const { organizationId, plan } = req.body;

        // Check if the organization exists
        const organization = await Organization.findByPk(organizationId);
        if (!organization) return res.status(404).json({ message: "Organization not found" });

        // Define Subscription Duration
        let startDate = new Date();
        let endDate = new Date();
        if (plan === "monthly") {
            endDate.setMonth(endDate.getMonth() + 1);
        } else if (plan === "yearly") {
            endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
            return res.status(400).json({ message: "Invalid subscription plan" });
        }

        const subscription = await Subscription.create({
            organizationId,
            plan,
            startDate,
            endDate,
            status: "active"
        });

        res.status(201).json({ message: "Subscription created", subscription });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get All Subscriptions (Admin Only)
const getSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.findAll();
        res.json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get Subscription by Organization ID
const getSubscriptionByOrg = async (req, res) => {
    try {
        const { organizationId } = req.params;
        const subscription = await Subscription.findOne({ where: { organizationId } });
        if (!subscription) return res.status(404).json({ message: "Subscription not found" });

        res.json(subscription);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Validate Subscription Status
const checkSubscriptionStatus = async (req, res) => {
    try {
        const { organizationId } = req.params;
        const subscription = await Subscription.findOne({ 
            where: { 
                organizationId, 
                endDate: { [Op.gt]: new Date() } 
            } 
        });

        if (!subscription) return res.json({ isValid: false, message: "Subscription expired or not found" });

        res.json({ isValid: true, message: "Subscription is active" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Cancel Subscription
const cancelSubscription = async (req, res) => {
    try {
        const { organizationId } = req.params;
        const subscription = await Subscription.findOne({ where: { organizationId } });
        if (!subscription) return res.status(404).json({ message: "Subscription not found" });

        subscription.status = "expired";
        subscription.endDate = new Date();
        await subscription.save();

        res.json({ message: "Subscription canceled", subscription });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const expireSubscriptionsNow = async (req, res) => {
    try {
        const expiredSubscriptions = await Subscription.findAll({
            where: { endDate: { [Op.lt]: new Date() }, status: "active" }
        });
        console.log(expiredSubscriptions);
        
        if (expiredSubscriptions.length === 0) {
            return res.json({ message: "No subscriptions to expire." });
        }

        await Subscription.update({ status: "expired" }, {
            where: { id: expiredSubscriptions.map(sub => sub.id) }
        });

        res.json({ message: `Expired ${expiredSubscriptions.length} subscriptions.` });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { createSubscription, getSubscriptions, getSubscriptionByOrg, checkSubscriptionStatus, cancelSubscription,expireSubscriptionsNow };
