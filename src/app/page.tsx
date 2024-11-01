// frontend/app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { Player } from '@/types'
import { GameStatus } from '@/components/GameStatus'
import { Meeting } from '@/components/Meeting'

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [playerName, setPlayerName] = useState('')
  const [player, setPlayer] = useState<Player | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [players, setPlayers] = useState<Player[]>([])
  const [meetingActive, setMeetingActive] = useState(false)
  const [meetingTimeLeft, setMeetingTimeLeft] = useState(120000)
  const [message, setMessage] = useState<{ text: string; color: string } | null>(null)

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001')
    setSocket(newSocket)

    newSocket.on('gameStarted', (gameState) => {
      setGameStarted(true)
      setPlayers(gameState.players)
      const currentPlayer = gameState.players.find((p: any) => p.id === player?.id)
      if (currentPlayer) {
        setPlayer(currentPlayer)
        setMessage({
          text: currentPlayer.isImpostor ? 'IMPOSTOR' : 'PLAYER',
          color: currentPlayer.isImpostor ? 'red' : 'green'
        })
        setTimeout(() => setMessage(null), 5000)
      }
    })

    newSocket.on('meetingCalled', () => {
      setMeetingActive(true)
      setMeetingTimeLeft(120000)
    })

    newSocket.on('meetingEnded', () => {
      setMeetingActive(false)
    })

    newSocket.on('crewmatesWin', () => {
      setMessage({
        text: player?.isImpostor ? 'DEFEAT' : 'VICTORY',
        color: player?.isImpostor ? 'red' : 'blue'
      })
      setTimeout(() => {
        setMessage(null)
        setGameStarted(false)
        setPlayer(null)
      }, 5000)
    })

    newSocket.on('impostorsWin', () => {
      setMessage({
        text: player?.isImpostor ? 'VICTORY' : 'DEFEAT',
        color: player?.isImpostor ? 'blue' : 'red'
      })
      setTimeout(() => {
        setMessage(null)
        setGameStarted(false)
        setPlayer(null)
      }, 5000)
    })

    return () => {
      newSocket.close()
    }
  }, [])

  const handleJoinGame = () => {
    if (!playerName || !socket) return
    socket.emit('joinGame', { playerName })
  }

  const handleStartGame = () => {
    if (!socket) return
    socket.emit('startGame')
  }

  const handleCallMeeting = () => {
    if (!socket || !player) return
    socket.emit('callMeeting', player.id)
  }

  const handleVote = (targetId: number) => {
    if (!socket || !player) return
    socket.emit('castVote', { voterId: player.id, targetId })
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center">Join Game</h1>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="w-full p-3 border rounded mb-4"
          />
          <button
            onClick={handleJoinGame}
            className="w-full bg-blue-500 text-white p-3 rounded"
          >
            Join Game
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {message && (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50`}>
          <div className={`text-6xl font-bold text-${message.color}-500`}>
            {message.text}
          </div>
        </div>
      )}

      <GameStatus
        isImpostor={player.isImpostor}
        totalTasks={player.isImpostor ? 0 : 100}
        completedTasks={players.reduce((sum, p) => 
          sum + p.tasks.filter(t => t.completed).length, 0
        )}
      />

      {!gameStarted ? (
        <div className="container mx-auto p-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl mb-4">Waiting for players...</h2>
            {players.length >= 3 && player.id === 1 && (
              <button
                onClick={handleStartGame}
                className="bg-green-500 text-white px-6 py-3 rounded"
              >
                Start Game
              </button>
            )}
            <div className="mt-4">
              <h3 className="text-xl mb-2">Players ({players.length}/20):</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {players.map((p) => (
                  <div key={p.id} className="bg-gray-100 p-3 rounded">
                    {p.name} #{p.id}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto p-4">
          <button
            onClick={handleCallMeeting}
            className="fixed top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Call Meeting
          </button>

          {!player.isImpostor && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16">
              {player.tasks.map((task) => (
                <div key={task.id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-xl mb-2">Task in Room {task.roomNumber}</h3>
                  {!task.completed && (
                    <a
                      href={`/task/${task.id}`}
                      className="inline-block bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Start Task
                    </a>
                  )}
                  {task.completed && (
                    <div className="text-green-500 font-bold">Completed!</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {meetingActive && (
            <Meeting
              players={players}
              onVote={handleVote}
              timeLeft={meetingTimeLeft}
            />
          )}
        </div>
      )}
    </div>
  )
}