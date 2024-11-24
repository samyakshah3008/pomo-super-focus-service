import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
  path: ".env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port`);
    });
  })
  .catch((error) => {
    console.error("Something went wrong to the root of the service", error);
  });

app.use("/test", (req, res) => {
  res.json({ message: "Hello from express app" });
});
