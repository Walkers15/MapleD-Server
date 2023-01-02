/* eslint-disable @typescript-eslint/typedef */
import mongoose from "mongoose";
import { getCharacterDetail, getMuLungAndUnionFromGG, getMuLungAndUnionFromMaple } from "../tools/crawler";
import { ISearchedCharacter } from "./searchedCharacter.model";

export interface IDiaryCharacter {
  nickname: string;
  job: string;
  level: number;
  exp: number;
  meso: number;
  str: number;
  dex: number;
  int: number;
  luk: number;
  statAttack: number;
  bossAttack: string;
  muLung: number;
  union: number;
  createdAt?: string;
  updatedAt?: string;
}

const diaryCharacterSchema: mongoose.Schema = new mongoose.Schema<IDiaryCharacter>(
  {
    nickname: {
      type: String,
      required: true,
      minlength: 2,
    },
    job: {
      type: String,
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
    muLung: {
      type: Number,
    },
    union: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const diaryCharacter: mongoose.Model<IDiaryCharacter> = mongoose.model<IDiaryCharacter>("DiaryCharacter", diaryCharacterSchema);

/**
 * 메이플스토리 홈페이지에서 캐릭터 정보를 가져와 DB에 저장
 * 첫 번째 등록의 경우 maple.gg에서 무릉정보를 가져옴
 * @param baseCharacterInfo
 * @param isFirstRegister
 * @returns
 */
export async function registerCharacter(baseCharacterInfo: ISearchedCharacter, isFirstRegister: boolean): Promise<IDiaryCharacter> {
  const characterDetail = await getCharacterDetail(baseCharacterInfo.nickname, baseCharacterInfo.detailURL);
  if (isFirstRegister) {
    const { union, muLung } = await getMuLungAndUnionFromGG(baseCharacterInfo.nickname);
    characterDetail.union = union;
    characterDetail.muLung = muLung;
  } else {
    const { union, muLung } = await getMuLungAndUnionFromMaple(baseCharacterInfo.nickname);
    if (!muLung) {
      const muLung = (await getMuLungAndUnionFromGG(baseCharacterInfo.nickname)).muLung;
      characterDetail.muLung = muLung;
    } else {
      characterDetail.muLung = muLung;
    }
    characterDetail.union = union;
  }
  const result = await new diaryCharacter(characterDetail).save();
  return result;
}
