const { v4: uuidv4 } = require("uuid");
const Organization = require("../models/Organization");

// Create Organization
const createOrganization = async (req, res) => {
    try {
        const { name, subscriptionStatus } = req.body;
        const organization = await Organization.create({
            id: uuidv4(),
            name,
            ownerId: req.user.id,
            subscriptionStatus: subscriptionStatus || "inactive",
        });

        res.status(201).json({ message: "Organization created", organization });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get All Organizations (Only Admins)
const getOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.findAll();
        res.json(organizations);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Update Organization
const updateOrganization = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, subscriptionStatus } = req.body;

        let organization = await Organization.findByPk(id);
        if (!organization) return res.status(404).json({ message: "Organization not found" });

        organization.name = name || organization.name;
        organization.subscriptionStatus = subscriptionStatus || organization.subscriptionStatus;
        await organization.save();

        res.json({ message: "Organization updated", organization });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete Organization
const deleteOrganization = async (req, res) => {
    try {
        const { id } = req.params;
        const organization = await Organization.findByPk(id);
        if (!organization) return res.status(404).json({ message: "Organization not found" });

        await organization.destroy();
        res.json({ message: "Organization deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { createOrganization, getOrganizations, updateOrganization, deleteOrganization };
