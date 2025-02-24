const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Brand = sequelize.define("Brand", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    organizationId: { type: DataTypes.UUID, allowNull: false }
}, { timestamps: true });

module.exports = Brand;
