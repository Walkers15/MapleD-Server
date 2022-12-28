import * as cheerio from "cheerio";
import axios from "axios";
import { readFile, writeFile } from "fs/promises";
import { HOME, RANKING_SEARCH } from "../Constant/Constant";
import { addSearchedCharacter } from "../models/searchedCharacter.model";
import { IDiaryCharacter } from "../models/diaryCharacter.model";

interface INonExistCharacterInfo {
  isExist: false;
}
interface IExistCharacterInfo {
  isExist: true;
  nickname: string;
  job: string;
  level: string;
  detailURL: string;
}

export type CharacterInfo = INonExistCharacterInfo | IExistCharacterInfo;

export async function getCharacterInfo(nickname: string): Promise<CharacterInfo> {
  const rankingHTML = (await axios.get<string>(`${RANKING_SEARCH}?c=${encodeURI(nickname)}`)).data;
  // const rankingHTML = await readFile("./rankHTML.html");
  const isCharacterExist = !rankingHTML.includes("랭킹정보가 없습니다.");
  let characterInfo: CharacterInfo = null;
  if (isCharacterExist) {
    console.log("캐릭터 있음!!");
    // console.log(rankingHTML);
    const $ = cheerio.load(rankingHTML);
    // console.log($('.search_com_chk').text());
    const target = $(".search_com_chk");
    console.log(target.find("dt").text());
    console.log(target.find("dd").text());
    console.log(target.find("td").eq(2).text());

    characterInfo = {
      isExist: true,
      nickname: target.find("dt").text(),
      job: target.find("dd").text(),
      level: target.find("td").eq(2).text(),
      detailURL: `${target.find("dt").find("a").attr("href")}`,
    };

    await addSearchedCharacter(characterInfo.nickname, characterInfo.detailURL);
  } else {
    console.log("캐릭터 없음 ㅠ");
    characterInfo = {
      isExist: false,
    };
  }

  return characterInfo;
}

export async function getCharacterDetail(nickname: string, detailURL: string): Promise<IDiaryCharacter> {
  const detailHTML = (await axios.get<string>(detailURL)).data;
  // await writeFile("./detailHTML2.html", detailHTML);
  // const detailHTML = await readFile("./detailHTML2.html");
  // console.log("detailHTML");
  // console.log(detailHTML.toString());

  const $2 = cheerio.load(detailHTML);
  // const baseInfo = $2(".char_info").find("span").eq(0).text().slice(3);
  // 9번 메소 13번 스공 19번 힘 21번 덱스 23번 인트 25번 럭 29번 보공
  const detailInfo = $2(".tab01_con_wrap").find("span");
  const statAttack = detailInfo.eq(13).text();
  const characterDetail: IDiaryCharacter = {
    nickname,
    level: Number($2(".char_info").find("dd").eq(0).text().slice(3)),
    exp: Number($2(".char_info").find("span").eq(0).text().slice(3).replace(/,/g, "")),
    meso: Number(detailInfo.eq(9).text().replace(/,/g, "")),
    str: Number(detailInfo.eq(19).text().replace(/,/g, "")),
    dex: Number(detailInfo.eq(21).text().replace(/,/g, "")),
    int: Number(detailInfo.eq(23).text().replace(/,/g, "")),
    luk: Number(detailInfo.eq(25).text().replace(/,/g, "")),
    statAttack: Number(statAttack.slice(statAttack.indexOf(" ~ ") + 3).replace(/,/g, "")),
    bossAttack: detailInfo.eq(29).text(),
  };

  console.log(characterDetail);
  return characterDetail;
}
