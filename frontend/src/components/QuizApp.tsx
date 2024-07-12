import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5001');

interface Participant {
  id: string;
  name: string;
}

const QuizApp: React.FC = () => {
  const [quizCode, setQuizCode] = useState('');
  const [quizName, setQuizName] = useState('');
  const [userName, setUserName] = useState('');
  const [inLobby, setInLobby] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    socket.on('new_participant', (participants: Participant[]) => {
      console.log('New participant event received:', participants);
      setParticipants(participants);
    });

    socket.on('quiz_started', (data: { question: string; options: string[] }) => {
      setQuizStarted(true);
      setQuestion(data.question);
      setOptions(data.options);
    });

    socket.on('quiz_ended', () => {
      setQuizStarted(false);
      setParticipants([]);
    });

    return () => {
      socket.off('new_participant');
      socket.off('quiz_started');
      socket.off('quiz_ended');
    };
  }, []);

  const createQuiz = () => {
    socket.emit('create_quiz', quizName, (response: { success: boolean; message: string; quizCode: string }) => {
      if (response.success) {
        setQuizCode(response.quizCode);
        setInLobby(true);
        setIsCreator(true);
      } else {
        alert(response.message);
      }
    });
  };

  const joinQuiz = () => {
    socket.emit('join_quiz', quizCode, userName, (response: { success: boolean; message: string; participants: Participant[] }) => {
      if (response.success) {
        setInLobby(true);
        setParticipants(response.participants);
        setIsCreator(false);
      } else {
        alert(response.message);
      }
    });
  };

  const startQuiz = () => {
    socket.emit('start_quiz', quizCode, (response: { success: boolean; message: string }) => {
      if (response.success) {
        setQuizStarted(true);
      } else {
        alert(response.message);
      }
    });
  };

  return (
    <div className="flex-1 p-4">
      {!inLobby ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Tạo hoặc Tham gia Phòng Quiz</h2>
          <input
            type="text"
            placeholder="Nhập tên phòng"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            className="border p-2 mb-2"
          />
          <button onClick={createQuiz} className="bg-blue-500 text-white py-2 px-4 rounded mb-4">
            Tạo Phòng
          </button>
          <div>
            <input
              type="text"
              placeholder="Nhập mã phòng"
              value={quizCode}
              onChange={(e) => setQuizCode(e.target.value)}
              className="border p-2 mb-2"
            />
            <input
              type="text"
              placeholder="Nhập tên của bạn"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="border p-2 mb-2"
            />
            <button onClick={joinQuiz} className="bg-green-500 text-white py-2 px-4 rounded">
              Tham gia Phòng
            </button>
          </div>
        </div>
      ) : (
        <div>
          {!quizStarted ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Sảnh Chờ</h2>
              <p className="text-lg">Mã phòng: <strong>{quizCode}</strong></p>
              <ul className="list-disc list-inside">
                {participants.map((participant) => (
                  <li key={participant.id}>{participant.name}</li>
                ))}
              </ul>
                <button onClick={startQuiz} className="bg-red-500 text-white py-2 px-4 rounded mt-4">
                  Bắt đầu Quiz
                </button>
              
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-4">Câu Hỏi: {question}</h2>
              <ul className="list-disc list-inside">
                {options.map((option, index) => (
                  <li key={index}>{option}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizApp;
