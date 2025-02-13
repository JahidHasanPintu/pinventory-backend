require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/payments", paymentRoutes);

app.use("/api/subscriptions", subscriptionRoutes);
//intial root directory
app.get("/",(req,res)=>{
    res.send("Hi, welcome to pinventory api v1.0 💥")
})
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    try {
        await db.authenticate();
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    } catch (error) {
        console.error("Database connection failed:", error);
    }
});
