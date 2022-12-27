import { Router } from "express";
import { addCharacter } from "../models/character.model";

export const registerRouter = Router();

registerRouter.route("/").post(async (req, res) => {
  try {
    const nickname = req.body.nickname;
    // 메이플에 해당 캐릭터가 존재하는지 확인
    const newUser = await addCharacter(nickname);
    // 투두 크롤링 구현
    res.json(`User added! ${newUser.nickname}`);
  } catch (error) {
    res.status(500);
    res.json(error);
  }

});

// registerRouter.route("/:name").post(async (req, res) => {
//   const newName = req.body.newname;

//   try {
//     const user = await Character.findOne({ nickname: req.params.name });

//     if (!user) {
//       res.json(`Cannot find user Name: ${req.params.name}`);
//       return;
//     }

//     console.log(`change ${user.nickname} to ${newName}`);

//     user.nickname = newName;
//     const newUser = await user.save();
//     console.log(`change to ${newUser.nickname} success!`);

//     res.json(`change to ${newUser.nickname} success!`);
//   } catch (error) {
//     console.error(error);
//     res.json(error);
//   }
// });
