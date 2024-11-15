import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import bucketListRouter from "./routes/bucket-list.routes.js";
import customWorkingFrameworkRouter from "./routes/custom-working-framework.routes.js";
import goalsRouter from "./routes/goal.routes.js";
import gratitudeRouter from "./routes/gratitude.routes.js";
import habitsRouter from "./routes/habits.routes.js";
import leaderboardRouter from "./routes/leaderboard.routes.js";
import pomodoroRouter from "./routes/pomodoro.routes.js";
import selfReviewRouter from "./routes/self-review.routes.js";
import streakRouter from "./routes/streak.routes.js";
import tasksRouter from "./routes/tasks.routes.js";
import userRouter from "./routes/user.routes.js";
import workingFrameworkRouter from "./routes/working-framework.routes.js";

// import { sendHabitReminders } from "./utils/cronJobs.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/pomodoros", pomodoroRouter);
app.use("/api/v1/streaks", streakRouter);
app.use("/api/v1/leaderboard", leaderboardRouter);
app.use("/api/v1/working-framework", workingFrameworkRouter);
app.use("/api/v1/custom-working-framework", customWorkingFrameworkRouter);
app.use("/api/v1/habits", habitsRouter);
app.use("/api/v1/gratitude", gratitudeRouter);
app.use("/api/v1/bucket-list", bucketListRouter);
app.use("/api/v1/goals", goalsRouter);
app.use("/api/v1/tasks", tasksRouter);
app.use("/api/v1/self-review", selfReviewRouter);

// cron.schedule("* * * * *", sendHabitReminders);

export default app;
