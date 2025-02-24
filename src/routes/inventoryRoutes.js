const express = require("express");
const router = express.Router();
const {
    createCategory, getCategories, updateCategory, deleteCategory,
    createSubcategory, getSubcategories,
    createBrand
} = require("../controllers/inventoryController");
const authMiddleware = require("../middleware/authMiddleware");

// Category Routes
router.post("/categories", authMiddleware, createCategory);
router.get("/categories", authMiddleware, getCategories);
router.put("/categories/:id", authMiddleware, updateCategory);
router.delete("/categories/:id", authMiddleware, deleteCategory);

// Subcategory Routes
router.post("/subcategories", authMiddleware, createSubcategory);
router.get("/subcategories", authMiddleware, getSubcategories);

// Brand Routes
router.post("/brands", authMiddleware, createBrand);

module.exports = router;
