const { Worker } = require("bullmq");

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

    return {
      success: true,
      message: "Email job processed successfully"
    };
  },
  {
    connection: redisConnection
  }
);

emailWorker.on("completed", (job) => {
  console.log("Email job completed:", job.id);
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