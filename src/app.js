import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import leaderboardRouter from "./routes/leaderboard.routes.js";
import pomodoroRouter from "./routes/pomodoro.routes.js";
import streakRouter from "./routes/streak.routes.js";
import todoRouter from "./routes/todo.routes.js";
import userRouter from "./routes/user.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/todos", todoRouter);
app.use("/api/v1/pomodoros", pomodoroRouter);
app.use("/api/v1/streaks", streakRouter);
app.use("/api/v1/leaderboard", leaderboardRouter);

export default app;
