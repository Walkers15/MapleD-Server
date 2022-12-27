/* eslint-disable @typescript-eslint/typedef */
import mongoose from "mongoose";

export interface ICharacter extends mongoose.Document {
  nickname: string;
}

const characterSchema: mongoose.Schema = new mongoose.Schema<ICharacter>(
  {
    nickname: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
    },
  },
  {
    timestamps: true,
  }
);

export const Character: mongoose.Model<ICharacter> = mongoose.model<ICharacter>("Character", characterSchema);

export async function addCharacter(nickname: string): Promise<ICharacter> {
  const user = new Character({
    nickname,
  });
  await user.save();

  console.log(user.nickname); // 'Bill'
  return user;
}
