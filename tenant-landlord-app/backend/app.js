//import dotenv from "dotenv";
import express from "express";
import landlordRouter from "./routes/landlord_router.js";
import tenantRouter from "./routes/tenant_router.js";
//dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/landlord", landlordRouter);
app.use("/api/tenant", tenantRouter);

app.get("/api", (req, res) => {
  res.json({
    success: 1,
    message: "This is a working REST API",
  });
});

app.listen(3000, () => {
  console.log(`Server is working on port 3000`);
});
