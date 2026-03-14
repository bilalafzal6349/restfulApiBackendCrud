import express, { json } from "express";
const app = express();

app.use(json());

import userRoutes from "./routes/users.js";
app.use("/users", userRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
