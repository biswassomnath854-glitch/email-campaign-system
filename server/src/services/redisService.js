const redis = require("../config/redis");

const setValue = async (key, value, expiryInSeconds = null) => {
  if (expiryInSeconds) {
    await redis.set(key, value, "EX", expiryInSeconds);
    return;
  }

  await redis.set(key, value);
};

const getValue = async (key) => {
  return redis.get(key);
};

const deleteValue = async (key) => {
  return redis.del(key);
};

const checkRedisConnection = async () => {
  return redis.ping();
};

module.exports = {
  setValue,
  getValue,
  deleteValue,
  checkRedisConnection
};