import { Router } from "express";
import { DiaryCharacter } from "../models/diaryCharacter.model";
import { searchedCharacter } from "../models/searchedCharacter.model";
import { getCharacterInfo } from "../tools/crawler";
// import axios from 'axios';
// import { RANKING_SEARCH } from "../Constant/Constant";

export const searchRouter = Router();

searchRouter.route("/:nickname").get(async (req, res) => {
  const nickname = req.params.nickname;
  try {
    const result = await searchedCharacter.findOne({ nickname });
    if (!result) {
      const characterInfo = await getCharacterInfo(nickname);
      if (characterInfo.isExist) {
        // 도큐먼트에는 없지만 존재하는 경우 (첫 입력)

        res.json({ message: `${characterInfo.level} ${characterInfo.nickname} (${characterInfo.job}) 캐릭터를 다이어리에 등록할까요?` });
      } else {
        // 메이플 서버에도 없으면 에러
        res.status(500);
        res.json({ message: "존재하지 않는 캐릭터입니다. " });
      }
    } else {
      // 캐릭터가 존재하는 경우 크롤링 데이터를 가져옴
      res.json({ message: await DiaryCharacter.find({ nickname: req.params.nickname }) });
    }
  } catch (error) {
    res.json(error);
  }
});
