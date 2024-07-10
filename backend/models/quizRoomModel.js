import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctOption: {
    type: String,
    required: true,
  },
});

const quizRoomSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true,
        },
        username: {
          type: String,
          required: true,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: false,
    },
    roomCode: {
      type: String,
      required: true,
      unique: true,
      default: () => nanoid(6),
    },
    questions: [questionSchema],
  },
  { timestamps: true }
);

const QuizRoom = mongoose.model('QuizRoom', quizRoomSchema);

export default QuizRoom;
