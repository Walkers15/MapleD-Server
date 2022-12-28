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
      required: true,
    },
    exp: {
      type: Number,
      required: true,
    },
    meso: {
      type: Number,
      required: true,
    },
    str: {
      type: Number,
      required: true,
    },
    dex: {
      type: Number,
      required: true,
    },
    int: {
      type: Number,
      required: true,
    },
    luk: {
      type: Number,
      required: true,
    },
    statAttack: {
      type: Number,
      required: true,
    },
    bossAttack: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const DiaryCharacter: mongoose.Model<IDiaryCharacter> = mongoose.model<IDiaryCharacter>("DiaryCaharacter", dirayCharacterSchema);

export async function registerCharacter(baseCharacterInfo: ISearchedCharacter): Promise<IDiaryCharacter> {
  const characterDetail = await getCharacterDetail(baseCharacterInfo.nickname, `${HOME}${baseCharacterInfo.detailURL}`);
  const result = await new DiaryCharacter(characterDetail).save();
  return result;
}
