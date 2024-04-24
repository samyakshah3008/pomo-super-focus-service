import cors from "cors";
import express from "express";

const app = express();

app.use(cors);
app.use(express.json());

app.post("/api/hello", (req, res) => {
  res.send({ msg: "hello world" });
});

export default app;
