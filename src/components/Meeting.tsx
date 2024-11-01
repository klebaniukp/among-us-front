// frontend/components/Meeting.tsx
import { useState, useEffect } from 'react';
import { Player } from '../types';

interface MeetingProps {
  players: Player[];
  onVote: (targetId: number) => void;
  timeLeft: number;
}

export const Meeting: React.FC<MeetingProps> = ({ players, onVote, timeLeft }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (targetId: number) => {
    if (!hasVoted) {
      setSelectedPlayer(targetId);
      setHasVoted(true);
      onVote(targetId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <div className="text-2xl font-bold mb-4 text-center">
          Emergency Meeting!
        </div>
        <div className="text-xl text-center mb-4">
          Time remaining: {Math.floor(timeLeft / 1000)} seconds
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {players.filter(p => p.isAlive).map((player) => (
            <button
              key={player.id}
              onClick={() => handleVote(player.id)}
              disabled={hasVoted}
              className={`p-4 rounded-lg border-2 ${
                selectedPlayer === player.id
                  ? 'border-red-500 bg-red-100'
                  : 'border-gray-300 hover:border-blue-500'
              }`}
            >
              <div className="font-bold">{player.name}</div>
              <div className="text-sm text-gray-500">#{player.id}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};