const Redis = require("ioredis");
const dotenv = require("dotenv");
dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  reconnectOnError: (err) => true,
});
console.log("Redis Host:", process.env.REDIS_HOST);
console.log("Redis Port:", process.env.REDIS_PORT);

redis.on("connect", () => console.log("Redis Connected"));
redis.on("error", (err) => console.log("Redis Error:", err));
redis.on("close", () => console.log("Redis connection closed"));
redis.on("reconnecting", () => console.log("Reconnecting to Redis..."));

module.exports = redis;
