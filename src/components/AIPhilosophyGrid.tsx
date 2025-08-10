import React, { useState, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import content from '@/data/content.json';
import { useToast } from '@/hooks/use-toast';
import { generateChatResponse } from '@/lib/gemini-client';

type CellState = {
  content: string | null;
  isLoading: boolean;
  category?: string;
  tone?: string;
};

// Diverse philosophy categories to ensure variety
const PHILOSOPHY_CATEGORIES = [
  'Design Principles',
  'Technology Ethics',
  'User Experience',
  'Innovation Mindset',
  'Creative Process',
  'Human-Centered Design',
  'Digital Craftsmanship',
  'Problem Solving',
  'Collaboration',
  'Sustainability',
  'Accessibility',
  'Data & Analytics',
  'Visual Design',
  'Interaction Design',
  'System Thinking',
  'Future Vision'
];

// Diverse tone and style variations
const TONE_VARIATIONS = [
  'inspirational and bold',
  'thoughtful and reflective',
  'practical and actionable',
  'philosophical and deep',
  'innovative and forward-thinking',
  'humanistic and empathetic',
  'technical and precise',
  'creative and artistic',
  'analytical and data-driven',
  'collaborative and inclusive',
  'sustainable and responsible',
  'experimental and playful',
  'minimalist and focused',
  'complex and nuanced',
  'direct and powerful',
  'poetic and metaphorical'
];

const AIPhilosophyGrid = () => {
  const [cells, setCells] = useState<CellState[]>(() => Array(16).fill({ content: null, isLoading: false }));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [generatedPhilosophies, setGeneratedPhilosophies] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const createPortfolioContext = () => {
    return `
        About: ${content.about.paragraph1}
        
        Projects: ${content.projects.map(p => `${p.title}: ${p.description} (Skills: ${p.tags.join(', ')})`).join('; ')}
        
        Design Philosophy: ${content.about.paragraph2}
        
        Companies worked with: ${content.workedWith.companies.map(c => c.name).join(', ')}
    `;
  };

  const generatePhilosophy = useCallback(async (cellIndex: number): Promise<string> => {
    try {
      const context = createPortfolioContext();
      const category = PHILOSOPHY_CATEGORIES[cellIndex];
      const tone = TONE_VARIATIONS[cellIndex];
      const previouslyGenerated = Array.from(generatedPhilosophies);
      
      // Add position-based context for more variety
      const row = Math.floor(cellIndex / 4) + 1;
      const col = (cellIndex % 4) + 1;
      const positionContext = `This philosophy will appear in row ${row}, column ${col} of the 4x4 grid.`;
      
      // Add randomization to make each generation unique
      const randomSeed = Math.random().toString(36).substring(7);
      
      const prompt = `
        Context about me and my work: ${context}
        
        TASK: Generate a unique, impactful design/development philosophy statement (2-6 words) for cell ${cellIndex + 1} of 16.
        ${positionContext}
        
        REQUIREMENTS:
        • Focus on: ${category}
        • Tone: ${tone}
        • Must be completely different from these previously generated philosophies: ${previouslyGenerated.join(', ') || 'none yet'}
        • Should reflect my approach to technology and design
        • Be specific, memorable, and actionable
        • Avoid generic phrases like "design with purpose" or "user-centered design"
        • Make it feel fresh and unexpected (random seed: ${randomSeed})
        
        EXAMPLES OF GOOD PHILOSOPHIES:
        • "Pixels whisper stories"
        • "Code dances with data"
        • "Interfaces breathe life"
        • "Technology hugs humanity"
        • "Design disrupts comfort"
        • "Data paints emotions"
        • "Simplicity breeds complexity"
        • "Failure fuels innovation"
        • "Micro-interactions, macro-impact"
        • "Digital empathy matters"
        • "Constraints spark creativity"
        • "Humanity in every pixel"
        
        Return only the philosophy statement, nothing else.`;

      const response = await generateChatResponse(prompt);
      const philosophy = response.trim();
      
      // Add to generated set to avoid repetition
      setGeneratedPhilosophies(prev => new Set([...prev, philosophy]));
      
      return { philosophy, category, tone };

    } catch (error) {
      toast({
        title: "Philosophy Generation Error",
        description: "Failed to generate philosophy. Please try again.",
        variant: "destructive",
      });
      
      // Enhanced diverse fallback philosophies with more variety
      const fallbacks = [
        'Pixels whisper stories',
        'Code dances with data',
        'Interfaces breathe life',
        'Technology hugs humanity',
        'Design disrupts comfort',
        'Data paints emotions',
        'Simplicity breeds complexity',
        'Failure fuels innovation',
        'Micro-interactions, macro-impact',
        'Digital empathy matters',
        'Constraints spark creativity',
        'Humanity in every pixel',
        'Innovation through iteration',
        'Design for tomorrow',
        'Technology serves stories',
        'Craft over convenience'
      ];
      return { 
        philosophy: fallbacks[cellIndex % fallbacks.length], 
        category: PHILOSOPHY_CATEGORIES[cellIndex], 
        tone: TONE_VARIATIONS[cellIndex] 
      };
    }
  }, [toast, generatedPhilosophies]);

  const handleClick = useCallback(async (index: number) => {
    if (cells[index].isLoading) return;
    
    if (cells[index].content) {
      setSelectedIndex(selectedIndex === index ? null : index);
      return;
    }

    setCells(prevCells => {
      const newCells = [...prevCells];
      newCells[index] = { ...newCells[index], isLoading: true };
      return newCells;
    });

    try {
      const result = await generatePhilosophy(index);
      
      setCells(prevCells => {
        const newCells = [...prevCells];
        newCells[index] = { 
          content: result.philosophy, 
          isLoading: false,
          category: result.category,
          tone: result.tone
        };
        return newCells;
      });
    } catch (error) {
      setCells(prevCells => {
        const newCells = [...prevCells];
        newCells[index] = { 
          content: 'Design with purpose', 
          isLoading: false,
          category: PHILOSOPHY_CATEGORIES[index],
          tone: TONE_VARIATIONS[index]
        };
        return newCells;
      });
    }
  }, [cells, generatePhilosophy, selectedIndex]);

  const generatedCount = cells.filter(cell => cell.content).length;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Chat Panel Header */}
      <div className="mb-6 p-4 bg-background/80 backdrop-blur-md rounded-t-2xl border border-border/50">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          <span className="ml-4 text-sm text-foreground font-medium">
            AI Philosophy Generator
          </span>
        </div>
      </div>

      {/* Interactive Grid */}
      <div 
        className="grid grid-cols-4 grid-rows-4 gap-2 p-6 bg-background/60 backdrop-blur-md rounded-2xl border border-border/30 shadow-xl"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {cells.map((cell, i) => (
          <div
            key={i}
            className={cn(
              "relative group cursor-pointer transition-all duration-300 ease-out",
              (hoveredIndex === i || selectedIndex === i) && "scale-105 z-10",
              !(hoveredIndex === i || selectedIndex === i) && "scale-100 hover:scale-102"
            )}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleClick(i)}
            role="button"
            aria-label={`Generate philosophy for cell ${i + 1}`}
          >
            {/* Cell Background with Translucency */}
            <div className={cn(
              "w-full h-full min-h-[80px] rounded-xl transition-all duration-300",
              (hoveredIndex === i || selectedIndex === i)
                ? "bg-primary/10 shadow-lg shadow-primary/20"
                : "hover:bg-background/20"
            )}>
              
              {/* Content Container */}
              <div className="absolute inset-0 flex items-center justify-center p-3">
                {cell.isLoading ? (
                  <Skeleton className="w-full h-8 rounded-lg" />
                ) : cell.content ? (
                  <div className="text-center space-y-2">
                    <p className="text-primary font-semibold text-xs leading-tight animate-fade-in">
                      {cell.content}
                    </p>
                    {selectedIndex === i && (
                      <div className="flex justify-center space-x-1">
                        <div className="w-1 h-1 bg-primary/60 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-1 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-2 h-2 bg-muted-foreground/30 rounded-full group-hover:bg-primary/50 transition-colors duration-300"></div>
                )}
              </div>

              {/* Hover Glow Effect */}
              {(hoveredIndex === i || selectedIndex === i) && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-transparent animate-pulse"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Panel Footer */}
      <div className="mt-4 p-4 bg-background/80 backdrop-blur-md rounded-b-2xl border border-border/50">
        <div className="flex items-center justify-between text-xs text-foreground">
          <div className="flex items-center space-x-4">
            <span>Click any cell to generate a unique design philosophy</span>
            {generatedCount > 0 && (
              <button
                onClick={() => {
                  setCells(Array(16).fill({ content: null, isLoading: false }));
                  setGeneratedPhilosophies(new Set());
                  setSelectedIndex(null);
                }}
                className="text-primary hover:text-primary/80 transition-colors underline"
              >
                Reset all
              </button>
            )}
          </div>
          <span>{generatedCount}/16 philosophies generated</span>
        </div>
      </div>

      {/* Selected Philosophy Display */}
      {selectedIndex !== null && cells[selectedIndex]?.content && (
        <div className="mt-6 p-6 bg-background/90 backdrop-blur-md rounded-2xl border border-primary/20 shadow-lg animate-fade-in">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary text-sm font-bold">💭</span>
            </div>
            <div className="flex-1">
              <h3 className="text-primary font-semibold mb-2">Selected Philosophy</h3>
              <p className="text-foreground leading-relaxed text-lg mb-3">
                "{cells[selectedIndex].content}"
              </p>
              {cells[selectedIndex].category && cells[selectedIndex].tone && (
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {cells[selectedIndex].category}
                  </span>
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                    {cells[selectedIndex].tone}
                  </span>
                </div>
              )}
                              <button 
                  onClick={() => setSelectedIndex(null)}
                  className="text-xs text-foreground hover:text-primary transition-colors"
                >
                  Close
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPhilosophyGrid;
