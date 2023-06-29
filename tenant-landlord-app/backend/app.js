//import dotenv from "dotenv";
import express from "express";
import landlordRouter from "./routes/landlord_router.js";
import tenantRouter from "./routes/tenant_router.js";
import cors from "cors";
// import { genSaltSync, hashSync, compareSync } from "bcrypt";   //remove this
//dotenv.config();

//remove these lines
// const salt = genSaltSync(10);
// const password = hashSync("123", salt);
// console.log(password)

const app = express();
app.use(cors());

app.use(express.json());

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is working on PORT: `, process.env.APP_PORT);
});

app.get("/api", (req, res) => {
  res.json({
    success: 1,
    message: "This is a working REST API",
  });
});

app.use("/api/landlord", landlordRouter);
app.use("/api/tenant", tenantRouter);

