import express from "express";
import * as core from "express-serve-static-core";
import cors from "cors";
import { config } from "dotenv";
import mongoose from "mongoose";
import * as User from "./models/user.model";

console.log(`Server Restart`);

config();

const uri = String(process.env.ATLAS_URI);
mongoose.set("strictQuery", false);
mongoose.connect(uri);
const connection: mongoose.Connection = mongoose.connection;

connection.once("open", async () => {
  console.log("MongoDB database connection established successfully");
  console.log(await User.makeUser("Olaff"));
});

const app: core.Express = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
