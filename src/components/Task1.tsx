// frontend/components/Task1.tsx
import { useState, useEffect } from 'react';

export const Task1: React.FC<{ sequence: number[], onComplete: () => void }> = ({ sequence, onComplete }) => {
  const [displayMode, setDisplayMode] = useState(true);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayMode(false);
    }, sequence.length * 1000 + 1000);

    return () => clearTimeout(timer);
  }, [sequence]);

  const handleSquareClick = (index: number) => {
    if (displayMode) return;

    const newSequence = [...userSequence, index];
    setUserSequence(newSequence);

    if (newSequence.length === sequence.length) {
      const isCorrect = newSequence.every((num, i) => num === sequence[i]);
      setShowResult(true);
      
      if (isCorrect) {
        setTimeout(() => {
          onComplete();
        }, 1000);
      } else {
        setTimeout(() => {
          setUserSequence([]);
          setShowResult(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto p-4">
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          className={`
            w-24 h-24 border-2 border-black cursor-pointer
            ${displayMode && sequence[userSequence.length] === index ? 'bg-blue-500' : 'bg-white'}
            ${!displayMode && userSequence.includes(index) ? 'bg-gray-300' : ''}
          `}
          // frontend/components/Task1.tsx (continuation)
          onClick={() => handleSquareClick(index)}
        />
      ))}
      {showResult && (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}>
          <div className={`text-4xl font-bold ${userSequence.every((num, i) => num === sequence[i]) ? 'text-green-500' : 'text-red-500'}`}>
            {userSequence.every((num, i) => num === sequence[i]) ? 'Success!' : 'Try Again!'}
          </div>
        </div>
      )}
    </div>
  );
};