const { Sequelize } = require("sequelize");

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
});

db.sync()
    .then(() => console.log("✅ Database connected & synchronized"))
    .catch((err) => console.error("❌ Database connection error:", err));

module.exports = db;
