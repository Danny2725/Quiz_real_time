import mongoose from 'mongoose';
import QuizRoom from '../models/quizRoomModel.js';
import User from "../models/user.model.js";


// Tạo phòng trắc nghiệm
export const createRoom = async (req, res) => {
  const { roomName } = req.body;
  const hostId = req.user.id; // Trích xuất từ token

  if (!mongoose.Types.ObjectId.isValid(hostId)) {
    return res.status(400).json({ message: 'Invalid hostId' });
  }

  try {
    const host = await User.findById(hostId);
    if (!host) {
      return res.status(404).json({ message: 'Host not found' });
    }

    const newRoom = new QuizRoom({
      roomName,
      host: hostId,
    });

    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const joinRoomByCode = async (req, res) => {
  const { roomCode, userId } = req.body;

  try {
    const room = await QuizRoom.findOne({ roomCode });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.participants.includes(userId)) {
      return res.status(400).json({ message: 'User already in the room' });
    }

    room.participants.push(userId);
    await room.save();

    res.status(200).json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRoom = async (req, res) => {
  const { roomId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    return res.status(400).json({ message: 'Invalid roomId' });
  }

  try {
    const room = await QuizRoom.findById(roomId).populate('host participants', 'username email');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
