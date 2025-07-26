import React, { useState, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import content from '@/data/content.json';
import { useToast } from '@/hooks/use-toast';
import { generateChatResponse } from '@/lib/gemini-client';

type CellState = {
  content: string | null;
  isLoading: boolean;
};

const AIPhilosophyGrid = () => {
  const [cells, setCells] = useState<CellState[]>(() => Array(16).fill({ content: null, isLoading: false }));
  const { toast } = useToast();

  const createPortfolioContext = () => {
    return `
        About: ${content.about.paragraph1}
        
        Projects: ${content.projects.map(p => `${p.title}: ${p.description} (Skills: ${p.tags.join(', ')})`).join('; ')}
        
        Design Philosophy: ${content.about.paragraph2}
        
        Companies worked with: ${content.workedWith.companies.join(', ')}
    `;
  };

  const generatePhilosophy = useCallback(async (cellIndex: number): Promise<string> => {
    try {
      const context = createPortfolioContext();
      const prompt = `
        Context about me and my work: ${context}
        
        Based on this context, generate a short, impactful design/development philosophy statement (2-6 words).
        Make it unique and different from other philosophies. This is philosophy number ${cellIndex + 1} out of 16.
        The statement should reflect my approach to technology and design.
        
        Return only the philosophy statement, nothing else.`;

      const response = await generateChatResponse(prompt);
      return response.trim();

    } catch (error) {
      toast({
        title: "Philosophy Generation Error",
        description: "Failed to generate philosophy. Please try again.",
        variant: "destructive",
      });
      
      // Diverse fallback philosophies based on cell index
      const fallbacks = [
        'Design with purpose',
        'Code bridges human gaps',
        'Technology serves stories',
        'Innovation through empathy',
        'Human-centered creation',
        'Digital experiences matter',
        'Design thinking evolves',
        'Technology amplifies humanity',
        'Creative problem solving',
        'Accessible design principles',
        'Data-driven aesthetics',
        'Cross-platform harmony',
        'Sustainable design future',
        'Experimental interaction design',
        'Collaborative innovation',
        'Meaningful digital craft'
      ];
      return fallbacks[cellIndex % fallbacks.length];
    }
  }, [toast]);

  const handleClick = useCallback(async (index: number) => {
    if (cells[index].isLoading || cells[index].content) return;

    setCells(prevCells => {
      const newCells = [...prevCells];
      newCells[index] = { ...newCells[index], isLoading: true };
      return newCells;
    });

    try {
      const philosophy = await generatePhilosophy(index);
      
      setCells(prevCells => {
        const newCells = [...prevCells];
        newCells[index] = { content: philosophy, isLoading: false };
        return newCells;
      });
    } catch (error) {
      setCells(prevCells => {
        const newCells = [...prevCells];
        newCells[index] = { content: 'Design with purpose', isLoading: false };
        return newCells;
      });
    }
  }, [cells, generatePhilosophy]);

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
            <p className="text-primary font-bold animate-fade-in text-xs md:text-sm leading-tight">
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
