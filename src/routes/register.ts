import { Router } from "express";
import { diaryCharacter, registerCharacter } from "../models/diaryCharacter.model";
import { searchedCharacter } from "../models/searchedCharacter.model";

export const registerRouter = Router();

registerRouter.route("/").post(async (req, res) => {
  console.log("register 요청", req.body.nickname);
  try {
    const targetCharacter = await searchedCharacter.findOne({ nickname: req.body.nickname });
    console.log(targetCharacter);
    if (targetCharacter) {
      const alreadyExist = await diaryCharacter.findOne({ nickname: req.body.nickname });
      console.log(alreadyExist);
      if (alreadyExist) {
        res.status(500);
        res.json({ message: "이미 등록된 캐릭터입니다" });
      } else {
        console.log("등록시도");
        await registerCharacter(targetCharacter, true);
        res.json({ characterData: await diaryCharacter.find({ nickname: req.body.nickname }) });
      }
    } else {
      res.status(500);
      res.json("잘못된 접근입니다");
    }
  } catch (error) {
    res.status(500);
    res.json(error);
  }
});
