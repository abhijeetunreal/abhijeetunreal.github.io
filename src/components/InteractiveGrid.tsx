
import React, { useState } from 'react';
import { Philosophy } from '@/types/content';

type InteractiveGridProps = {
  philosophies: Philosophy[];
};

const InteractiveGrid = ({ philosophies }: InteractiveGridProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Use up to 4 philosophies for a 2x2 grid
  const gridPhilosophies = philosophies.slice(0, 4);

  return (
    <div 
      className="grid grid-cols-2 grid-rows-2 aspect-square border-2 border-border gap-px bg-border"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {gridPhilosophies.map((philosophy, i) => (
        <div
          key={i}
          className="bg-background hover:bg-primary/10 transition-colors cursor-pointer flex items-center justify-center text-center p-4 relative"
          onMouseEnter={() => setHoveredIndex(i)}
        >
          {hoveredIndex === i && (
            <p className="text-primary font-bold animate-fade-in text-sm md:text-base">
              {philosophy.statement}
            </p>
          )}
        </div>
      ))}
      {/* Fill remaining grid cells if less than 4 philosophies */}
      {Array.from({ length: 4 - gridPhilosophies.length }).map((_, i) => (
         <div key={`empty-${i}`} className="bg-background hover:bg-primary/10 transition-colors" />
      ))}
    </div>
  );
};

export default InteractiveGrid;
