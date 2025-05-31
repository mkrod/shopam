// redisClients.js
const redis = require("redis");

const publisher = redis.createClient({ url: process.env.REDIS_URL });
publisher.on("error", (err) => console.error("Redis Publisher error:", err));
publisher.connect().then(() => console.log("✅ Connected to Redis Publisher"));

module.exports = { publisher };
