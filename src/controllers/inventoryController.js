const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const Brand = require("../models/Brand");
const { Op } = require("sequelize");
const csvParser = require("csv-parser");
const xlsx = require("xlsx");
// Utility function for pagination
const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

// ✅ Create Category
const createCategory = async (req, res) => {
    try {
        const { name, organizationId } = req.body;
        const category = await Category.create({ name, organizationId });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: "Error creating category", error });
    }
};

// ✅ Get All Categories (with filtering, searching, pagination)
const getCategories = async (req, res) => {
    try {
        const { search, page, size } = req.query;
        const { limit, offset } = getPagination(page, size);

        let whereCondition = {};
        if (search) {
            whereCondition.name = { [Op.iLike]: `%${search}%` };
        }

        const categories = await Category.findAndCountAll({
            where: whereCondition,
            limit,
            offset
        });

        res.json({
            totalItems: categories.count,
            categories: categories.rows,
            totalPages: Math.ceil(categories.count / limit),
            currentPage: page ? +page : 0
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error });
    }
};

// ✅ Update Category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const category = await Category.findByPk(id);
        if (!category) return res.status(404).json({ message: "Category not found" });

        category.name = name;
        await category.save();

        res.json(category);
    } catch (error) {
        res.status(500).json({ message: "Error updating category", error });
    }
};

// ✅ Delete Category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);

        if (!category) return res.status(404).json({ message: "Category not found" });

        await category.destroy();
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting category", error });
    }
};

// 🔄 Similar CRUD functions for Subcategory and Brand
const createSubcategory = async (req, res) => {
    try {
        const { name, categoryId, organizationId } = req.body;
        const subcategory = await Subcategory.create({ name, categoryId, organizationId });
        res.status(201).json(subcategory);
    } catch (error) {
        res.status(500).json({ message: "Error creating subcategory", error });
    }
};

const getSubcategories = async (req, res) => {
    try {
        const { search, categoryId, page, size } = req.query;
        const { limit, offset } = getPagination(page, size);

        let whereCondition = {};
        if (search) whereCondition.name = { [Op.iLike]: `%${search}%` };
        if (categoryId) whereCondition.categoryId = categoryId;

        const subcategories = await Subcategory.findAndCountAll({
            where: whereCondition,
            limit,
            offset
        });

        res.json({
            totalItems: subcategories.count,
            subcategories: subcategories.rows,
            totalPages: Math.ceil(subcategories.count / limit),
            currentPage: page ? +page : 0
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching subcategories", error });
    }
};

const createBrand = async (req, res) => {
    try {
        const { name, organizationId } = req.body;
        const brand = await Brand.create({ name, organizationId });
        res.status(201).json(brand);
    } catch (error) {
        res.status(500).json({ message: "Error creating brand", error });
    }
};


// ✅ Import Categories from CSV/Excel
const importCategories = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const fileBuffer = req.file.buffer;
        let categories = [];

        if (req.file.mimetype.includes("csv")) {
            // Parse CSV
            const csvData = fileBuffer.toString("utf-8").split("\n");
            csvData.forEach((line, index) => {
                if (index === 0) return; // Skip header row
                const [name, organizationId] = line.split(",");
                if (name && organizationId) categories.push({ name, organizationId });
            });
        } else {
            // Parse Excel
            const workbook = xlsx.read(fileBuffer, { type: "buffer" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            categories = xlsx.utils.sheet_to_json(sheet);
        }

        await Category.bulkCreate(categories);
        res.json({ message: "Categories imported successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error importing categories", error });
    }
};

// ✅ Export Categories as CSV/Excel
const exportCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        const jsonData = categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            organizationId: cat.organizationId
        }));

        if (req.query.format === "csv") {
            // Convert to CSV format
            const csvData = ["id,name,organizationId"].concat(
                jsonData.map(cat => `${cat.id},${cat.name},${cat.organizationId}`)
            ).join("\n");

            res.header("Content-Type", "text/csv");
            res.attachment("categories.csv");
            return res.send(csvData);
        } else {
            // Convert to Excel
            const worksheet = xlsx.utils.json_to_sheet(jsonData);
            const workbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(workbook, worksheet, "Categories");

            res.header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.attachment("categories.xlsx");
            return res.send(xlsx.write(workbook, { type: "buffer" }));
        }
    } catch (error) {
        res.status(500).json({ message: "Error exporting categories", error });
    }
};



module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    createSubcategory,
    getSubcategories,
    createBrand,
    importCategories,
    exportCategories
};
