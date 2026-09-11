require("dotenv").config();

const { Worker } = require("bullmq");

const {
  sendEmail
} = require("../services/emailService");

const {
  EmailLog,
  CampaignRecipient
} = require("../models");

const {
  completeCampaign
} = require("../services/campaignCompletionService");

const redisConnection = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379
};

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    console.log("Processing email job:", job.id);
    console.log("Job name:", job.name);
    console.log("Job data:", job.data);

    const {
      to,
      subject,
      text,
      html,
      campaignId,
      recipientId
    } = job.data;

    if (!to) {
      throw new Error("Recipient email address is required");
    }

    if (!subject) {
      throw new Error("Email subject is required");
    }

    if (!text && !html) {
      throw new Error("Email content is required");
    }

    let emailLog = null;

    try {
      if (campaignId && recipientId) {
        emailLog = await EmailLog.create({
          campaignId,
          recipientId,
          status: "queued"
        });
      }

      const info = await sendEmail({
        to,
        subject,
        text,
        html
      });

      console.log("Email sent successfully");
      console.log("Message ID:", info.messageId);

      if (emailLog) {
        await emailLog.update({
          status: "sent",
          messageId: info.messageId,
          sentAt: new Date()
        });
      }

      if (campaignId && recipientId) {
        await CampaignRecipient.update(
          {
            status: "sent",
            sentAt: new Date()
          },
          {
            where: {
              campaignId,
              recipientId
            }
          }
        );

        try {
          const completionResult =
            await completeCampaign(campaignId);

          console.log(
            "Campaign completion check:",
            completionResult
          );
        } catch (completionError) {
          console.error(
            "Campaign completion check failed"
          );
          console.error(completionError.message);
        }
      }

      return {
        success: true,
        message: "Email sent successfully",
        messageId: info.messageId,
        emailLogId: emailLog ? emailLog.id : null
      };
    } catch (error) {
      console.error("Email sending failed");
      console.error(error.message);

      if (emailLog) {
        await emailLog.update({
          status: "failed",
          errorMessage: error.message
        });
      }

      if (campaignId && recipientId) {
        await CampaignRecipient.update(
          {
            status: "failed",
            sentAt: null
          },
          {
            where: {
              campaignId,
              recipientId
            }
          }
        );

        try {
          const completionResult =
            await completeCampaign(campaignId);

          console.log(
            "Campaign completion check after failure:",
            completionResult
          );
        } catch (completionError) {
          console.error(
            "Campaign completion check failed"
          );
          console.error(completionError.message);
        }
      }

      throw error;
    }
  },
  {
    connection: redisConnection
  }
);

emailWorker.on("completed", (job, result) => {
  console.log("Email job completed:", job.id);
  console.log("Worker result:", result);
});

emailWorker.on("failed", (job, error) => {
  console.error("Email job failed:", job?.id);
  console.error(error.message);
});

emailWorker.on("error", (error) => {
  console.error("Email worker error");
  console.error(error.message);
});

console.log("Email worker started successfully");

module.exports = emailWorker;