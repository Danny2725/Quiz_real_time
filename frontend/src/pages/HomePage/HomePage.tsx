import React from 'react';
import QuizApp from '../../components/QuizApp';

const HomePage: React.FC = () => {
  return (
    <main className="flex-1 p-4">
      <h2 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h2>
      <QuizApp />
    </main>
  );
};

export default HomePage;
