import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";

const PORT = process.env.PORT || 5000;

const startServer = async() => {
  await connectDB();
  await connectRedis();

  app.listen(PORT, () => {
    console.log(`Server is running on Port http://localhost:${PORT}`);
  });
};

startServer();