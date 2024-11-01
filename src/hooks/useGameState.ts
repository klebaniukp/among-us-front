// frontend/hooks/useGameState.ts
import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { Player } from '../types';

interface GameState {
  players: Player[];
  isGameStarted: boolean;
  totalTasksCompleted: number;
  meetingInProgress: boolean;
}

export function useGameState(socket: Socket | null) {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    isGameStarted: false,
    totalTasksCompleted: 0,
    meetingInProgress: false
  });

  useEffect(() => {
    if (!socket) return;

    socket.on('gameStateUpdate', (newState: GameState) => {
      setGameState(newState);
    });

    socket.on('playerJoined', (player: Player) => {
      setGameState(prev => ({
        ...prev,
        players: [...prev.players, player]
      }));
    });

    socket.on('playerLeft', (playerId: number) => {
      setGameState(prev => ({
        ...prev,
        players: prev.players.filter(p => p.id !== playerId)
      }));
    });

    socket.on('meetingCalled', () => {
      setGameState(prev => ({
        ...prev,
        meetingInProgress: true
      }));
    });

    socket.on('meetingEnded', () => {
      setGameState(prev => ({
        ...prev,
        meetingInProgress: false
      }));
    });

    return () => {
      socket.off('gameStateUpdate');
      socket.off('playerJoined');
      socket.off('playerLeft');
      socket.off('meetingCalled');
      socket.off('meetingEnded');
    };
  }, [socket]);

  return gameState;
}