const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Subscription = db.define("Subscription", {
    organizationId: { type: DataTypes.UUID, allowNull: false },
    plan: { 
        type: DataTypes.ENUM("monthly", "yearly"), 
        allowNull: false 
    },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
    status: { 
        type: DataTypes.ENUM("active", "expired"), 
        defaultValue: "active" 
    }
});

module.exports = Subscription;
