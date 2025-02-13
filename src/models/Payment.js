const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Payment = db.define("Payment", {
    organizationId: { type: DataTypes.UUID, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    method: { 
        type: DataTypes.ENUM("stripe", "sslcommerz", "amarpay", "bkash"), 
        allowNull: false 
    },
    status: { 
        type: DataTypes.ENUM("pending", "success", "failed"), 
        defaultValue: "pending" 
    },
    transactionId: { type: DataTypes.STRING, allowNull: true },
});

module.exports = Payment;
