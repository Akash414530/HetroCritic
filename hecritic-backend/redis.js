const redis = require("redis");
require("dotenv").config();

// Create Redis client using the URL from environment variables
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

// Event listener for Redis connection errors
redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

// Event listener for successful Redis connection
redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

// Event listener for Redis connection end
redisClient.on("end", () => {
  console.log("Redis connection ended");
});

// Function to handle graceful shutdown
const handleShutdown = () => {
  redisClient.quit(() => {
    console.log("Redis client disconnected through app termination");
    process.exit(0);
  });
};

// Listen for termination signals to handle graceful shutdown
process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);

module.exports = redisClient;
