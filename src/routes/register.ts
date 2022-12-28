import { Router } from "express";
import { DiaryCharacter, registerCharacter } from "../models/diaryCharacter.model";
import { searchedCharacter } from "../models/searchedCharacter.model";

export const registerRouter = Router();

registerRouter.route("/").post(async (req, res) => {
  try {
    const targetCharacter = await searchedCharacter.findOne({ nickname: req.body.nickname });
    if (targetCharacter) {
      const alreadyExist = await DiaryCharacter.findOne({ nickname: req.body.nickname });
      if (alreadyExist) {
        res.status(500);
        res.json({ message: "이미 등록된 캐릭터입니다" });
      } else {
        console.log("등록시도");
        const result = await registerCharacter(targetCharacter);
        res.json(`User added! ${result.nickname}`);
      }
    }
  } catch (error) {
    res.status(500);
    res.json(error);
  }
});
