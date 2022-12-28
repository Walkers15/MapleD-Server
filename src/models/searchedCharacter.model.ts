/* eslint-disable @typescript-eslint/typedef */
import mongoose from "mongoose";

export interface ISearchedCharacter {
  nickname: string;
  detailURL: string;
}

const searchedCharacterSchema: mongoose.Schema = new mongoose.Schema<ISearchedCharacter>(
  {
    nickname: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
    },
    detailURL: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const searchedCharacter: mongoose.Model<ISearchedCharacter> = mongoose.model<ISearchedCharacter>("SearchedCharacter", searchedCharacterSchema);

export async function addSearchedCharacter(nickname: string, detailURL: string): Promise<ISearchedCharacter> {
  const user = new searchedCharacter({
    nickname,
    detailURL,
  });
  await user.save();

  console.log(user.nickname);
  return user;
}
