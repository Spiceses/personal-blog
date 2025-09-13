// src/models/User.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  googleId: string;
  name: string;
  email: string;
  picture: string;
}

const UserSchema = new Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    picture: {
      type: String, // URL to the user's Google profile picture
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
