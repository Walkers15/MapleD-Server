import express from "express";
import * as core from "express-serve-static-core";
import cors from "cors";
import { config } from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import { registerRouter } from "./routes/register";
import { searchRouter } from "./routes/search";
import { refreshDiary } from "./tools/crawler";
import cron from "node-cron";
import { gptRouter } from "./routes/gpt";
console.log("Server Restart");

config();

const uri = String(process.env.ATLAS_URI);
mongoose.set("strictQuery", false);
mongoose.connect(uri);
const connection: mongoose.Connection = mongoose.connection;

connection.once("open", async () => {
  console.log("MongoDB database connection established successfully");
  cron.schedule("7 3 */1 * *", refreshDiary);
});

const app: core.Express = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use("/register", registerRouter);
app.use("/search", searchRouter);
app.use("/gpt", gptRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
