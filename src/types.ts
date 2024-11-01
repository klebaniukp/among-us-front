// frontend/src/types.ts
export interface Player {
    id: number;
    name: string;
    isImpostor: boolean;
    isAlive: boolean;
    tasks: Task[];
}

export interface Task {
    id: number;
    roomNumber: number;
    type: 1 | 2 | 3;
    completed: boolean;
    sequence?: number[];
    shapes?: string[];
}

interface g {}