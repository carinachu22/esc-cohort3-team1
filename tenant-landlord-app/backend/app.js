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

// The commented line makes it so that it uses a new random port instead of always 5000
// It fixes the address already in use error for jest, but for mocha it requires the specific 5000 port for the api calls to work
// So, this is commented out for the time being because jest will work but mocha will not
//app.listen((process.env.NODE_ENV === 'test' ? 0 : process.env.APP_PORT), () => {
app.listen(process.env.APP_PORT, () => {
  //console.log(`Server is working on PORT: `, process.env.APP_PORT);
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
