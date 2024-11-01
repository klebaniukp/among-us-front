// frontend/app/task/[taskId]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Task1 } from '@/components/Task1'
import { Task2 } from '@/components/Task2'
import { Task3 } from '@/components/Task3'
import { io, Socket } from 'socket.io-client'

export default function TaskPage({
  params
}: {
  params: { taskId: string }
}) {
  const router = useRouter()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [task, setTask] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001')
    setSocket(newSocket)

    // Get task details from server
    if (params.taskId) {
      newSocket.emit('getTask', params.taskId)
      newSocket.on('taskDetails', (taskDetails) => {
        setTask(taskDetails)
        setLoading(false)
      })
    }

    newSocket.on('meetingCalled', () => {
      router.push('/')
    })

    return () => {
      newSocket.close()
    }
  }, [params.taskId])

  const handleTaskComplete = () => {
    if (socket && task) {
      socket.emit('completeTask', { taskId: task.id })
      setTimeout(() => {
        router.push('/')
      }, 1000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading task...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Room {task.roomNumber} - Task {task.type}
        </h1>

        {task.type === 1 && (
          <Task1 
            sequence={task.sequence} 
            onComplete={handleTaskComplete}
          />
        )}

        {task.type === 2 && (
          <Task2 
            shapes={task.shapes} 
            onComplete={handleTaskComplete}
          />
        )}

        {task.type === 3 && (
          <Task3 
            onComplete={handleTaskComplete}
          />
        )}
      </div>
    </div>
  )
}