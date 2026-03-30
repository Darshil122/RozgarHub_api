const Redis = require("ioredis");
const dotenv = require('dotenv');
dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});


redis.on("connect", () => console.log("Redis Connected"));
redis.on("error", (err) => console.log("Redis Error:", err));

module.exports = redis;