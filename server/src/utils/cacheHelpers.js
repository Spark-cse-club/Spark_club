import redisClient from "../config/redis.js";

export const getCachedData = async(key) => {
  try {
    if(!redisClient.isReady) return null;

    const cachedData = await redisClient.get(key);

    return cachedData ? JSON.parse(cachedData) : null;
  }
  catch (error) {
    console.error("Redis get failed: ", error.message);
    return null;
  }
}

export const setCachedData = async( key, data, TTL = 600) => {
  try {
    if(!redisClient.isReady) return null;

    await redisClient.set(
      key,
      JSON.stringify(data), 
      {
        EX : TTL,
      }
    );

  } catch( error ){
    console.log("Redis SET failed:", error.message);
    return null;
  }
};

export const invalidateCache = async (keys = []) => {
  try {
    if (!redisClient.isReady || keys.length === 0) return;

    await redisClient.del(keys);
  } catch (error) {
    console.error("Redis invalidation failed:", error.message);
  }
};

