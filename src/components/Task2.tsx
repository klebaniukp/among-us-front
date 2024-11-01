// frontend/components/Task2.tsx
import { useState } from 'react';

const ShapeComponent: React.FC<{ shape: string }> = ({ shape }) => {
  const commonClasses = "w-20 h-20";
  
  switch (shape) {
    case 'triangle':
      return <div className={`${commonClasses} border-2 border-black`} style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />;
    case 'square':
      return <div className={`${commonClasses} border-2 border-black`} />;
    case 'circle':
      return <div className={`${commonClasses} border-2 border-black rounded-full`} />;
    case 'pentagon':
      return <div className={`${commonClasses} border-2 border-black`} style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }} />;
    case 'hexagon':
      return <div className={`${commonClasses} border-2 border-black`} style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }} />;
    default:
      return null;
  }
};

export const Task2: React.FC<{ shapes: string[], onComplete: () => void }> = ({ shapes, onComplete }) => {
  const [draggingShape, setDraggingShape] = useState<string | null>(null);
  const [completedShapes, setCompletedShapes] = useState<Set<number>>(new Set());
  const shuffledShapes = [...shapes].sort(() => Math.random() - 0.5);

  const handleDragStart = (shape: string) => {
    setDraggingShape(shape);
  };

  const handleDrop = (targetIndex: number) => {
    if (draggingShape === shapes[targetIndex] && !completedShapes.has(targetIndex)) {
      const newCompleted = new Set(completedShapes);
      newCompleted.add(targetIndex);
      setCompletedShapes(newCompleted);

      if (newCompleted.size === shapes.length) {
        setTimeout(onComplete, 1000);
      }
    }
    setDraggingShape(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="grid grid-cols-4 gap-4 mb-8">
        {shapes.map((shape, index) => (
          <div
            key={`target-${index}`}
            className={`border-2 border-dashed p-2 ${completedShapes.has(index) ? 'bg-green-100' : 'bg-white'}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(index)}
          >
            {completedShapes.has(index) && <ShapeComponent shape={shape} />}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {shuffledShapes.map((shape, index) => (
          <div
            key={`source-${index}`}
            draggable={true}
            onDragStart={() => handleDragStart(shape)}
            className={`p-2 ${draggingShape === shape ? 'opacity-50' : ''}`}
          >
            <ShapeComponent shape={shape} />
          </div>
        ))}
      </div>
    </div>
  );
};
