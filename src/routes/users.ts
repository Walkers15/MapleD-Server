import { Router } from "express";
import { User, addUser } from "../models/user.model";

export const userRouter = Router();

userRouter.route("/").get(async (_req, res) => {
  const result = await User.find();
  console.log(result);
  res.json(result);
});

userRouter.route("/add").post(async (req, res) => {
  const username = req.body.username;

  const newUser = await addUser(username);
  res.json(`User added! ${newUser.username}`);
});

userRouter.route("/update/:name").post(async (req, res) => {
  const newName = req.body.newname;

  try {
    const user = await User.findOne({ username: req.params.name });

    if (!user) {
      res.json(`Cannot find user Name: ${req.params.name}`);
      return;
    }

    console.log(`change ${user.username} to ${newName}`);

    user.username = newName;
    const newUser = await user.save();
    console.log(`change to ${newUser.username} success!`);

    res.json(`change to ${newUser.username} success!`);
  } catch (error) {
    console.error(error);
    res.json(error);
  }
});
