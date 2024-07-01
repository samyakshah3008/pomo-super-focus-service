import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import todoRouter from "./routes/todo.routes.js";
import userRouter from "./routes/user.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/todos", todoRouter);

export default app;
