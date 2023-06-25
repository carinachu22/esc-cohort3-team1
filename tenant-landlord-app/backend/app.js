import dotenv from "dotenv";
dotenv.config();

import express from "express";
import landlordRouter from "./routes/landlord_router.js";

const app = express();

app.use(express.json());

app.use("/api/landlord", landlordRouter);

app.get("/api", (req, res) => {
  res.json({
    success: 1,
    message: "This is a working REST API",
  });
});

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is working on port ${process.env.APP_PORT}`);
});
