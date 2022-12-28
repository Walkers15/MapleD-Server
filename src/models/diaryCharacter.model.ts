/* eslint-disable @typescript-eslint/typedef */
import mongoose from "mongoose";
import { HOME } from "../Constant/Constant";
import { getCharacterDetail } from "../tools/crawler";
import { ISearchedCharacter } from "./searchedCharacter.model";

export interface IDiaryCharacter {
  nickname: string;
  level: number;
  exp: number;
  meso: number;
  str: number;
  dex: number;
  int: number;
  luk: number;
  statAttack: number;
  bossAttack: string;
}

const dirayCharacterSchema: mongoose.Schema = new mongoose.Schema<IDiaryCharacter>(
  {
    nickname: {
      type: String,
      required: true,
      minlength: 2,
    },
    level: {
      type: Number,
    },
    exp: {
      type: Number,
    },
    meso: {
      type: Number,
    },
    str: {
      type: Number,
    },
    dex: {
      type: Number,
    },
    int: {
      type: Number,
    },
    luk: {
      type: Number,
    },
    statAttack: {
      type: Number,
    },
    bossAttack: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const diaryCharacter: mongoose.Model<IDiaryCharacter> = mongoose.model<IDiaryCharacter>("DiaryCharacter", dirayCharacterSchema);

export async function registerCharacter(baseCharacterInfo: ISearchedCharacter): Promise<IDiaryCharacter> {
  const characterDetail = await getCharacterDetail(baseCharacterInfo.nickname, `${HOME}${baseCharacterInfo.detailURL}`);
  const result = await new diaryCharacter(characterDetail).save();
  return result;
}
