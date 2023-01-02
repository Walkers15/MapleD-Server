import * as cheerio from "cheerio";
import axios from "axios";
import { DETAIL_SEARCH, MAPLE_GG_SEARCH, MULUNG_SEARCH, RANKING_SEARCH, UNION_SEARCH } from "../Constant/Constant";
import { addSearchedCharacter, searchedCharacter } from "../models/searchedCharacter.model";
import { diaryCharacter, IDiaryCharacter, registerCharacter } from "../models/diaryCharacter.model";

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
  const rankingHTML = (await axios.get<string>(RANKING_SEARCH(nickname))).data;
  console.log(RANKING_SEARCH(nickname));
  const isCharacterExist = !rankingHTML.includes("랭킹정보가 없습니다.");
  let characterInfo: CharacterInfo = null;
  if (isCharacterExist) {
    console.log("캐릭터 있음!!");
    const $ = cheerio.load(rankingHTML);
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
    console.log(characterInfo);
    await searchedCharacter.deleteOne({ nickname });
    console.log("괙", characterInfo.nickname, characterInfo.detailURL);
    await addSearchedCharacter(characterInfo.nickname, characterInfo.detailURL);
    console.log("곡");
  } else {
    console.log("캐릭터 없음 ㅠ");
    characterInfo = {
      isExist: false,
    };
  }

  return characterInfo;
}

export async function getCharacterDetail(nickname: string, detailURL: string): Promise<IDiaryCharacter> {
  const detailHTML = (await axios.get<string>(DETAIL_SEARCH(detailURL))).data;
  // await writeFile("detail.html", detailHTML);
  const $2 = cheerio.load(detailHTML);
  // 9번 메소 13번 스공 19번 힘 21번 덱스 23번 인트 25번 럭 29번 보공
  const detailInfo = $2(".tab01_con_wrap").find("span");
  const statAttack = detailInfo.eq(13).text();
  const characterDetail: IDiaryCharacter = {
    nickname,
    job: detailInfo.eq(3).text(),
    level: Number($2(".char_info").find("dd").eq(0).text().slice(3)),
    exp: Number($2(".char_info").find("span").eq(0).text().slice(3).replace(/,/g, "")),
    meso: Number(detailInfo.eq(9).text().replace(/,/g, "")),
    str: Number(detailInfo.eq(19).text().replace(/,/g, "")),
    dex: Number(detailInfo.eq(21).text().replace(/,/g, "")),
    int: Number(detailInfo.eq(23).text().replace(/,/g, "")),
    luk: Number(detailInfo.eq(25).text().replace(/,/g, "")),
    statAttack: Number(statAttack.slice(statAttack.indexOf(" ~ ") + 3).replace(/,/g, "")),
    bossAttack: detailInfo.eq(29).text(),
    muLung: null,
    union: null,
  };

  console.log(characterDetail);
  return characterDetail;
}

export async function refreshDiary(): Promise<void> {
  const diaryCharacters = await diaryCharacter.find({});
  const refreshCharacters = [...new Set(diaryCharacters.map((character) => character.nickname))];
  for (const nickname of refreshCharacters) {
    // getCharacterInfo를 통해 새로운 URL 갱신
    const characterInfo = await getCharacterInfo(nickname);
    if (characterInfo.isExist) {
      console.log(characterInfo.detailURL, characterInfo.nickname);
      await registerCharacter({ detailURL: characterInfo.detailURL, nickname }, false);
    }
    await delay(1000);
  }
}

export async function getMuLungAndUnionFromGG(nickname: string): Promise<{ muLung: number; union: number }> {
  const mapleggHTML = (await axios.get<string>(MAPLE_GG_SEARCH(nickname))).data;
  // const mapleggHTML = await readFile("Maplegg.html");
  const $ = cheerio.load(mapleggHTML);
  // console.log(mapleggHTML);
  const muLung = Number($(".user-summary-floor").text().slice(0, 2));
  const union = Number($(".user-summary-level").eq(0).text().slice(3, 7));
  console.log(muLung, union);
  return { muLung, union };
}

export async function getMuLungAndUnionFromMaple(nickname: string): Promise<{ muLung: number; union: number }> {
  const muLungHTML = (await axios.get<string>(MULUNG_SEARCH(nickname))).data;
  let muLung: number = null;
  if (!muLungHTML.includes("랭킹정보가 없습니다.")) {
    const $ = cheerio.load(muLungHTML);
    muLung = Number($(".search_com_chk").find("td").eq(3).text());
  }

  const unionHTML = (await axios.get<string>(UNION_SEARCH(nickname))).data;
  const $ = cheerio.load(unionHTML);
  const union = Number($(".search_com_chk").find("td").eq(2).text().replace(/,/g, ""));
  console.log(muLung, union);
  return { muLung, union };
}

function delay(time: number): Promise<unknown> {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
