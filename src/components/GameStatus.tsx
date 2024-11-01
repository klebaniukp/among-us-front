// frontend/components/GameStatus.tsx
interface GameStatusProps {
    isImpostor: boolean;
    totalTasks: number;
    completedTasks: number;
}
  
export const GameStatus: React.FC<GameStatusProps> = ({ isImpostor, totalTasks, completedTasks }) => {
    return (
        <div className="fixed top-0 right-0 m-4 p-4 bg-white rounded-lg shadow-lg">
        <div className={`w-4 h-4 rounded-full mb-2 ${isImpostor ? 'bg-red-600' : 'bg-green-600'}`} />
        <div className="text-sm">
            Tasks: {completedTasks}/{totalTasks}
        </div>
        </div>
    );
};