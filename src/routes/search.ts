import { Router } from "express";
import { Character } from "../models/character.model";
// import axios from 'axios';
// import { RANKING_SEARCH } from "../Constant/Constant";

export const searchRouter = Router();

searchRouter.route("/:nickname").get(async (req, res) => {
  const nickname = req.params.nickname;
  try {
    const result = await Character.findOne({ nickname });
    if (!result) {
      // TODO Maple Server에서 존재하는지 확인
      if (Math.random() > 0.5) {
        // 도큐먼트에는 없지만 존재하는 경우 (첫 입력)
        res.json({ message: "종로구심셔틀 (263, 비숍) 캐릭터를 다이어리에 등록할까요? " });

      } else {
        // 메이플 서버에도 없으면 에러
        res.status(500);
        res.json({ message: "존재하지 않는 캐릭터입니다. " });
      }
    } else {
      // 캐릭터가 존재하는 경우 크롤링 데이터를 가져옴
      // TODO 크롤링 데이터 가져오기 구현
      res.json({ message: "정보 블라블라" });
    }

  } catch (error) {
    res.json(error);
  }
});

// interface CharacterInfo {
//   nickname: string,
//   job: string,
//   level: number
// };
// export async function validateCharacter(nickname: string): Promise<CharacterInfo> {
//   const rankingHTML = await axios.get<string>(`${RANKING_SEARCH}?c=${encodeURI(nickname)}`)
//   const isCharacterExist = rankingHTML.data.includes("랭킹정보가 없습니다.");
//   if (!isCharacterExist) {

//   }
//   console.log(search);
//   return null;
// }