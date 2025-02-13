const cron = require("node-cron");
const Subscription = require("../models/Subscription");
const Organization = require("../models/Organization");
const sendEmail = require("./emailService");
const { Op } = require("sequelize");

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
    console.log("Running subscription expiry and notification job...");

    try {
        const today = new Date();
        const reminderDate = new Date();
        reminderDate.setDate(today.getDate() + 3); // 3 days before expiry

        // Find subscriptions expiring in 3 days
        const expiringSoon = await Subscription.findAll({
            where: {
                endDate: { [Op.between]: [today, reminderDate] },
                status: "active"
            }
        });

        // Send reminder emails
        for (let sub of expiringSoon) {
            const org = await Organization.findByPk(sub.organizationId);
            if (org && org.email) {
                await sendEmail(
                    org.email,
                    "Subscription Expiry Reminder",
                    `<p>Dear ${org.name},</p>
                     <p>Your subscription will expire on <b>${sub.endDate.toDateString()}</b>.</p>
                     <p>Please renew to continue using our services.</p>`
                );
            }
        }

        // Find expired subscriptions
        const expiredSubscriptions = await Subscription.findAll({
            where: { endDate: { [Op.lt]: today }, status: "active" }
        });

        // Expire subscriptions and send emails
        for (let sub of expiredSubscriptions) {
            sub.status = "expired";
            await sub.save();

            const org = await Organization.findByPk(sub.organizationId);
            if (org && org.email) {
                await sendEmail(
                    org.email,
                    "Subscription Expired",
                    `<p>Dear ${org.name},</p>
                     <p>Your subscription has expired.</p>
                     <p>Please renew to regain access.</p>`
                );
            }
        }

        console.log(`Processed ${expiringSoon.length} reminders and ${expiredSubscriptions.length} expirations.`);
    } catch (error) {
        console.error("Error in subscription job:", error);
    }
});
