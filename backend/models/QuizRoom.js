import mongoose from "mongoose";

const quizRoomSchema = new mongoose.Schema({
  quizCode: { type: String, required: true, unique: true },
  quizName: { type: String, required: true },
  participants: [{ id: String, name: String }],
  creatorId: { type: String, required: true },
  question: { type: String, default: '2 + 2 = ?' },
  options: { type: [String], default: ['3', '4', '5', '6'] },
});

const QuizRoom = mongoose.model('QuizRoom', quizRoomSchema);

export default QuizRoom;
