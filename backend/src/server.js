import express from "express";
import cors from "cors";
import { scheduleDailyHabitJob } from "./lib/cronJobs.js";

import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";

const app = express();

const PORT = process.env.PORT || 3000;

// to schedule the cron job
// scheduleDailyHabitJob();

app.use(
  express.json({
    limit: "100mb",
  })
); // allows us to parse json data in body
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
  connectDB();
});
