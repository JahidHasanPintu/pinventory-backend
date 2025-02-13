const express = require("express");
const { createOrganization, getOrganizations, updateOrganization, deleteOrganization } = require("../controllers/organizationController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createOrganization);
router.get("/", authMiddleware, adminMiddleware, getOrganizations);
router.put("/:id", authMiddleware, adminMiddleware, updateOrganization);
router.delete("/:id", authMiddleware, adminMiddleware, deleteOrganization);

module.exports = router;
