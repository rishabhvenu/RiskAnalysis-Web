import mongoose, { Schema } from "mongoose";
import { nanoid } from "nanoid";

const User = mongoose.model(
  "User",
  new Schema({
    _id: { type: String, default: () => nanoid() },
    username: String,
    email: String,
    password: String,
  })
);

export default User;
