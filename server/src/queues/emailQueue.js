const { Queue } = require("bullmq");

const redisConnection = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379
};

const emailQueue = new Queue("emailQueue", {
  connection: redisConnection
});

module.exports = emailQueue;