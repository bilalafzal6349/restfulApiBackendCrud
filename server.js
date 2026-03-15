import "dotenv/config";
import express, { json } from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/users.js";

const app = express();
app.use(json());

connectDB().then(() => {
  app.listen(process.env.PORT || 3002, () => {
    console.log(` Server is running on port ${process.env.PORT || 3002}`);
  });
});

app.use("/users", userRoutes);
