import mongoose from 'mongoose';
import QuizRoom from '../models/quizRoomModel.js';
import User from "../models/user.model.js";


// Tạo phòng trắc nghiệm
export const createRoom = async (req, res) => {
  const { roomName } = req.body;
  const hostId = req.user.id;

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


// Tham gia phòng trắc nghiệm bằng mã phòng và tên người dùng
export const joinRoomByCode = async (req, res) => {
  const { roomCode, username } = req.body;

  try {
    const room = await QuizRoom.findOne({ roomCode });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const existingParticipant = room.participants.find(
      participant => participant.username === username
    );

    if (existingParticipant) {
      return res.status(400).json({ message: 'Username already in the room' });
    }

    const newParticipant = {
      _id: new mongoose.Types.ObjectId(),
      username,
    };

    room.participants.push(newParticipant);
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


export const getUserRooms = async (req, res) => {
  const hostId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(hostId)) {
    return res.status(400).json({ message: 'Invalid hostId' });
  }

  try {
    const rooms = await QuizRoom.find({ host: hostId }).populate('host participants', 'username email');

    if (!rooms || rooms.length === 0) {
      return res.status(404).json({ message: 'No rooms found' });
    }

    res.status(200).json(rooms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const startRoom = async (req, res) => {
  const { roomId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    return res.status(400).json({ message: 'Invalid roomId' });
  }

  try {
    const room = await QuizRoom.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room.isActive = true;
    await room.save();

    res.status(200).json({ message: 'Room started successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
