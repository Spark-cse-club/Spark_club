
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import errorMiddleware from "./middleware/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/event.routes.js";
import projectRoutes from "./routes/project.routes.js";
import galleryRoutes from "./routes/gallery.routes.js";
import teamsRoutes from "./routes/team.routes.js";
import acheivementsRoutes from "./routes/achievement.routes.js";
import contactRoutes from "./routes/contact.routes.js";
 
const app = express();

const limiter = rateLimit({
  windowMs : 15 * 60 * 1000, // 15 miniutes
  limit : 100,
  message : "Too many requests, try again later",
});

app.use(helmet());
app.use(limiter);
app.use(
  cors({
    origin : "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());


app.get("/", (req,res)=>{
  res.json({
    message : "Spark Club Website is active"
  })
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/achievements", acheivementsRoutes);
app.use("/api/contact", contactRoutes);

app.use(errorMiddleware);

export default app;
