
import React, { useState, useCallback } from 'react';
import { generatePhilosophy } from '@/lib/ai';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import content from '@/data/content.json';

type CellState = {
  content: string | null;
  isLoading: boolean;
};

const AIPhilosophyGrid = () => {
  const [cells, setCells] = useState<CellState[]>(() => Array(16).fill({ content: null, isLoading: false }));

  const handleClick = useCallback(async (index: number) => {
    if (cells[index].isLoading || cells[index].content) return;

    setCells(prevCells => {
      const newCells = [...prevCells];
      newCells[index] = { ...newCells[index], isLoading: true };
      return newCells;
    });

    try {
      const philosophy = await generatePhilosophy(content.aiPhilosophy);
      
      setCells(prevCells => {
        const newCells = [...prevCells];
        newCells[index] = { content: philosophy, isLoading: false };
        return newCells;
      });
    } catch (error) {
      console.error("Failed to generate philosophy:", error);
      setCells(prevCells => {
        const newCells = [...prevCells];
        newCells[index] = { content: 'Error generating.', isLoading: false };
        return newCells;
      });
    }
  }, [cells]);

  return (
    <div className="grid grid-cols-4 grid-rows-4 aspect-square border-2 border-border gap-px bg-border">
      {cells.map((cell, i) => (
        <div
          key={i}
          className={cn(
            "bg-background hover:bg-primary/10 transition-colors cursor-pointer flex items-center justify-center text-center p-2 relative",
            cell.content && "cursor-default hover:bg-background"
          )}
          onClick={() => handleClick(i)}
          role="button"
          aria-label={`Generate philosophy for cell ${i + 1}`}
        >
          {cell.isLoading ? (
            <Skeleton className="w-full h-8" />
          ) : cell.content ? (
            <p className="text-primary font-bold animate-fade-in text-xs md:text-sm">
              {cell.content}
            </p>
          ) : (
            <div className="w-2 h-2 bg-border rounded-full transition-colors" />
          )}
        </div>
      ))}
    </div>
  );
};

export default AIPhilosophyGrid;
