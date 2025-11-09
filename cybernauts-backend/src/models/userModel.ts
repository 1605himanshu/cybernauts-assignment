import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  username: string;
  age: number;
  hobbies: string[];
  friends: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  popularityScore: number;
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    hobbies: {
      type: [String],
      default: [],
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    popularityScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
