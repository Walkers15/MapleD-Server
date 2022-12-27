/* eslint-disable @typescript-eslint/typedef */
import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  username: string;
}

const userSchema: mongoose.Schema = new mongoose.Schema<IUser>(
  {
    username: {
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

export const User: mongoose.Model<IUser> = mongoose.model<IUser>("User", userSchema);

export async function addUser(username: string): Promise<IUser> {
  const user = new User({
    username,
  });
  await user.save();

  console.log(user.username); // 'Bill'
  return user;
}
