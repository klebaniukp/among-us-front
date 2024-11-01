// frontend/components/Task3.tsx
import { useState, useEffect } from 'react';

export const Task3: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      onComplete();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onComplete]);

  return (
    <div className="max-w-md mx-auto p-4 text-center">
      <div className="text-6xl font-bold mb-8">
        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </div>
      {!isRunning && (
        <button
          onClick={() => setIsRunning(true)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg text-xl"
        >
          Start Timer
        </button>
      )}
    </div>
  );
};