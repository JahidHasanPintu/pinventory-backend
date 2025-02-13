const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Organization = db.define("Organization", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    ownerId: { type: DataTypes.INTEGER, allowNull: false },
    subscriptionStatus: { 
        type: DataTypes.ENUM("active", "inactive", "pending"), 
        defaultValue: "inactive" 
    },
});

module.exports = Organization;
