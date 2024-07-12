import { Server } from "socket.io";
import QuizRoom from "./models/QuizRoom.js";

const generateQuizCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const initializeSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log('Client mới kết nối:', socket.id);

    socket.on('check_quiz', async (quizCode, callback) => {
      try {
        const room = await QuizRoom.findOne({ quizCode });
        callback({ exists: !!room });
      } catch (err) {
        console.error(err);
        callback({ exists: false });
      }
    });

    socket.on('create_quiz', async (quizName, callback) => {
      try {
        const quizCode = generateQuizCode();
        const newRoom = new QuizRoom({ quizCode, quizName, participants: [], creatorId: socket.id });
        await newRoom.save();
        console.log(`Quiz được tạo với mã: ${quizCode}`);
        callback({ success: true, message: 'Phòng quiz được tạo thành công', quizCode });
      } catch (err) {
        console.error(err);
        callback({ success: false, message: 'Không thể tạo phòng quiz' });
      }
    });

    socket.on('join_quiz', async (quizCode, userName, callback) => {
      try {
        const room = await QuizRoom.findOne({ quizCode });
        if (!room) {
          callback({ success: false, message: 'Mã quiz không tồn tại' });
          return;
        }
        socket.join(quizCode);
        room.participants.push({ id: socket.id, name: userName });
        await room.save();
        io.to(quizCode).emit('new_participant', room.participants);
        callback({ success: true, message: 'Tham gia phòng quiz thành công', participants: room.participants });
      } catch (err) {
        console.error(err);
        callback({ success: false, message: 'Không thể tham gia phòng quiz' });
      }
    });

    socket.on('start_quiz', async (quizCode, callback) => {
      try {
        const room = await QuizRoom.findOne({ quizCode });
        if (!room) {
          callback({ success: false, message: 'Mã quiz không tồn tại' });
          return;
        }
        if (room.creatorId !== socket.id) {
          callback({ success: false, message: 'Chỉ có người tạo mới có thể bắt đầu quiz' });
          return;
        }
        io.to(quizCode).emit('quiz_started', { question: room.question, options: room.options });
        callback({ success: true, message: 'Quiz bắt đầu' });
      } catch (err) {
        console.error(err);
        callback({ success: false, message: 'Không thể bắt đầu quiz' });
      }
    });

    socket.on('leave_quiz', async (quizCode, callback) => {
      try {
        const room = await QuizRoom.findOne({ quizCode });
        if (!room) {
          callback({ success: false, message: 'Mã quiz không tồn tại' });
          return;
        }
        room.participants = room.participants.filter(p => p.id !== socket.id);
        await room.save();
        socket.leave(quizCode);
        io.to(quizCode).emit('new_participant', room.participants);

        if (room.participants.length === 0) {
          io.to(quizCode).emit('quiz_ended');
        }
        
        callback({ success: true, message: 'Rời khỏi phòng quiz thành công' });
      } catch (err) {
        console.error(err);
        callback({ success: false, message: 'Không thể rời khỏi phòng quiz' });
      }
    });

    socket.on('end_quiz', async (quizCode, callback) => {
      try {
        const room = await QuizRoom.findOne({ quizCode });
        if (!room) {
          callback({ success: false, message: 'Mã quiz không tồn tại' });
          return;
        }
        if (room.creatorId !== socket.id) {
          callback({ success: false, message: 'Chỉ có người tạo mới có thể kết thúc quiz' });
          return;
        }
        io.to(quizCode).emit('quiz_ended');
        callback({ success: true, message: 'Quiz kết thúc' });
      } catch (err) {
        console.error(err);
        callback({ success: false, message: 'Không thể kết thúc quiz' });
      }
    });

    socket.on('submit_answer', (quizCode, userName, answer) => {
      console.log(`Nhận được câu trả lời từ ${userName}: ${answer}`);
      io.to(quizCode).emit('answer_submitted', { userName, answer });
    });

    socket.on('disconnect', async () => {
      console.log('Client ngắt kết nối:', socket.id);
      try {
        const room = await QuizRoom.findOne({ participants: { $elemMatch: { id: socket.id } } });
        if (room) {
          room.participants = room.participants.filter(p => p.id !== socket.id);
          await room.save();
          io.to(room.quizCode).emit('new_participant', room.participants);
          if (room.participants.length === 0) {
            io.to(room.quizCode).emit('quiz_ended');
          }
        }
      } catch (err) {
        console.error(err);
      }
    });
  });

  return io;
};

export default initializeSocketServer;
