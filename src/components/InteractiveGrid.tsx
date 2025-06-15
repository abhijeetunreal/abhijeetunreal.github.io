
import React, { useState } from 'react';

const GRID_SIZE = 100;
const gridItems = Array.from({ length: GRID_SIZE });

const InteractiveGrid = () => {
  const [revealed, setRevealed] = useState(false);

  const handleClick = () => {
    setRevealed(!revealed);
  };

  if (revealed) {
    return (
        <div onClick={handleClick} className="aspect-square p-6 border-2 border-primary flex items-center justify-center text-center cursor-pointer bg-primary/10">
            <p className="text-primary font-bold animate-fade-in">I believe in design as a medium for conversation, not just a solution.</p>
        </div>
    )
  }

  return (
    <div onClick={handleClick} className="grid grid-cols-10 aspect-square border-2 border-border cursor-pointer">
      {gridItems.map((_, i) => (
        <div key={i} className="border border-accent hover:bg-primary transition-colors" />
      ))}
    </div>
  );
};

export default InteractiveGrid;
