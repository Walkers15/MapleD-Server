import express from "express";
import * as core from "express-serve-static-core";
import cors from "cors";
import { config } from "dotenv";
import mongoose from "mongoose";
import { userRouter } from "./routes/users";
import morgan from "morgan";

console.log(`Server Restart`);

config();

const uri = String(process.env.ATLAS_URI);
mongoose.set("strictQuery", false);
mongoose.connect(uri);
const connection: mongoose.Connection = mongoose.connection;

connection.once("open", async () => {
  console.log("MongoDB database connection established successfully");
});

const app: core.Express = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
