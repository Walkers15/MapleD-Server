import express from "express";
import * as core from "express-serve-static-core";
import cors from "cors";
import { config } from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import { registerRouter } from "./routes/register";
import { searchRouter } from "./routes/search";
import * as cheerio from "cheerio";
import { HOME, RANKING_SEARCH } from "./Constant/Constant";
import axios from "axios";
import { readFile, writeFile } from "fs/promises";

console.log("Server Restart");

config();

const uri = String(process.env.ATLAS_URI);
mongoose.set("strictQuery", false);
mongoose.connect(uri);
const connection: mongoose.Connection = mongoose.connection;

connection.once("open", async () => {
  console.log("MongoDB database connection established successfully");

  // const rankingHTML = (await axios.get<string>(`${RANKING_SEARCH}?c=${encodeURI("종로구심셔틀")}`)).data;
  const rankingHTML = await readFile("./rankHTML.html");
  const isCharacterExist = !rankingHTML.includes("랭킹정보가 없습니다.");
  if (isCharacterExist) {
    console.log("캐릭터 있음!!");
    // console.log(rankingHTML);
    const $ = cheerio.load(rankingHTML);
    // console.log($('.search_com_chk').text());
    const target = $(".search_com_chk");
    console.log(target.find("dt").text());
    console.log(target.find("dd").text());
    console.log(target.find("td").eq(2).text());

    const detailURL = `${HOME}${target.find("dt").find("a").attr("href")}`;
    console.log(detailURL);

    // const detailHTML = (await axios.get<string>(detailURL)).data;
    // await writeFile("./detailHTML2.html", detailHTML);
    const detailHTML = await readFile("./detailHTML2.html");
    // console.log("detailHTML");
    // console.log(detailHTML.toString());

    const $2 = cheerio.load(detailHTML);
    const baseInfo = $2(".char_info").find("span").eq(0).text().slice(3);
    const detailInfo = $2(".tab01_con_wrap").find("span").text();
    console.log(baseInfo);
    console.log($2(".char_info").find("span").eq(1).text().slice(3));
    // console.log(baseInfo.eq(0).text());
    console.log(detailInfo);

  } else {
    console.log("캐릭터 없음 ㅠ");
  }
});

const app: core.Express = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use("/register", registerRouter);
app.use("/search", searchRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
