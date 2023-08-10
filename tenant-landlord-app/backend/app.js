//import dotenv from "dotenv";
import express from "express";
import landlordRouter from "./routes/landlord_router.js";
import tenantRouter from "./routes/tenant_router.js";
import adminRouter from "./routes/admin_router.js";
import cors from "cors";

const app = express();

app.use(cors());

// for parsing application/json
app.use(express.json());

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

// for parsing multipart/form-data
// app.use(upload.array());
app.use(express.static("public"));

app.listen(process.env.APP_PORT, () => {
  // console.log(`Server is working on PORT: `, process.env.APP_PORT);
});

app.get("/api", (req, res) => {
  res.json({
    success: 1,
    message: "This is a working REST API",
  });
});

app.use("/api/landlord", landlordRouter);
app.use("/api/tenant", tenantRouter);
app.use("/api/admin", adminRouter);

export default app;
