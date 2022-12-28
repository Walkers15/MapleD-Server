import { Router } from "express";
import { diaryCharacter } from "../models/diaryCharacter.model";
import { getCharacterInfo } from "../tools/crawler";
// import axios from 'axios';
// import { RANKING_SEARCH } from "../Constant/Constant";

export const searchRouter = Router();

searchRouter.route("/:nickname").get(async (req, res) => {
  const nickname = req.params.nickname;
  try {
    console.log(nickname);
    const result = await diaryCharacter.findOne({ nickname });
    if (result) {
      // 캐릭터가 다이어리에 존재하는 경우 크롤링 데이터를 가져옴
      res.json({ isRegister: true, characterData: await diaryCharacter.find({ nickname: req.params.nickname }) });
    } else {
      console.log("캐릭터 없음!!");
      const characterInfo = await getCharacterInfo(nickname);
      if (characterInfo.isExist) {
        // 다이어리 도큐먼트에는 없지만 존재하는 경우 (첫 입력)
        res.json({ isRegister: false, message: `${characterInfo.level} ${characterInfo.nickname} (${characterInfo.job}) 캐릭터를 다이어리에 등록할까요?` });
      } else {
        // 메이플 서버에도 없으면 에러
        res.status(500);
        res.json({ message: "존재하지 않는 캐릭터입니다. " });
      }
    }
  } catch (error) {
    res.json(error);
  }
});
