import { createClient } from "redis";

const redisClient = createClient({
  url : process.env.REDIS_URL,
});

redisClient.on("error", (error) => {
  console.log("Redis error : ", error.message);
});

export const connectRedis = async() => {
  try {
    await redisClient.connect();
    console.log("Redis Connected successfully");
    
  } catch(error) {
    console.error("Redis connection failed: ", error
      .message);
  }
}

export default redisClient;