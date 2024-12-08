import redis from "redis";

// Connect to Redis (You can configure this with your Redis server)
const client = redis.createClient();
client.on("error", (err) => console.log("Redis error: " + err));

// Function to blacklist the token
export const blacklistToken = (token) => {
  // Add the token to the blacklist in Redis with an expiration that matches the JWT expiration
  client.setEx(token, 24 * 60 * 60, "blacklisted"); // Example: Blacklist for 1 day
};

// Function to check if token is blacklisted
export const isTokenBlacklisted = (token, next) => {
  client.get(token, (err, data) => {
    if (err) {
      return next(err);
    }
    if (data === "blacklisted") {
      return next(new Error("Token is blacklisted"));
    }
    next();
  });
};
