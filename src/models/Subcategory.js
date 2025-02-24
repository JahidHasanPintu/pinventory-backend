const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Subcategory = sequelize.define("Subcategory", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    categoryId: { type: DataTypes.UUID, allowNull: false },
    organizationId: { type: DataTypes.UUID, allowNull: false }
}, { timestamps: true });

module.exports = Subcategory;
