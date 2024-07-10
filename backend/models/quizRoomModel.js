import mongoose from "mongoose";
import { nanoid } from "nanoid";

const quizRoomSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    roomCode: {
      type: String,
      required: true,
      unique: true,
      default: () => nanoid(6), // Tạo mã phòng ngẫu nhiên gồm 6 ký tự
    },
  },
  { timestamps: true }
);

const QuizRoom = mongoose.model("QuizRoom", quizRoomSchema);

export default QuizRoom;
