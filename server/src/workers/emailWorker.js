require("dotenv").config();

const { Worker } = require("bullmq");

const { sendEmail } = require("../services/emailService");

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

    const { to, subject, text, html } = job.data;

    if (!to) {
      throw new Error("Recipient email address is required");
    }

    if (!subject) {
      throw new Error("Email subject is required");
    }

    if (!text && !html) {
      throw new Error("Email content is required");
    }

    const info = await sendEmail({
      to,
      subject,
      text,
      html
    });

    console.log("Email sent successfully");
    console.log("Message ID:", info.messageId);

    return {
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId
    };
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