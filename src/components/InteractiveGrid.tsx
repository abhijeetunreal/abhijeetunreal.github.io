
import React, { useState, useEffect } from 'react';
import { Philosophy } from '@/types/content';

type InteractiveGridProps = {
  philosophies: Philosophy[];
};

const InteractiveGrid = ({ philosophies }: InteractiveGridProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [displayedPhilosophies, setDisplayedPhilosophies] = useState<Philosophy[]>([]);

  // Shuffle and select 16 philosophies for a 4x4 grid
  useEffect(() => {
    const shuffled = [...philosophies].sort(() => Math.random() - 0.5);
    setDisplayedPhilosophies(shuffled.slice(0, 16));
  }, [philosophies]);

  const handleCellClick = (index: number) => {
    setSelectedIndex(selectedIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Chat Panel Header */}
      <div className="mb-6 p-4 bg-background/80 backdrop-blur-md rounded-t-2xl border border-border/50">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          <span className="ml-4 text-sm text-foreground font-medium">
            Design Philosophy Generator
          </span>
        </div>
      </div>

      {/* Interactive Grid */}
      <div 
        className="grid grid-cols-4 grid-rows-4 gap-2 p-6 bg-background/60 backdrop-blur-md rounded-2xl border border-border/30 shadow-xl"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {displayedPhilosophies.map((philosophy, i) => (
          <div
            key={i}
            className={`
              relative group cursor-pointer transition-all duration-300 ease-out
              ${hoveredIndex === i || selectedIndex === i 
                ? 'scale-105 z-10' 
                : 'scale-100 hover:scale-102'
              }
            `}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleCellClick(i)}
          >
            {/* Cell Background with Translucency */}
            <div className={`
              w-full h-full min-h-[80px] rounded-xl border-2 transition-all duration-300
              ${hoveredIndex === i || selectedIndex === i
                ? 'bg-primary/20 border-primary/50 shadow-lg shadow-primary/20'
                : 'bg-background/40 border-border/30 hover:bg-background/60 hover:border-border/50'
              }
              backdrop-blur-sm
            `}>
              
              {/* Content Container */}
              <div className="absolute inset-0 flex items-center justify-center p-3">
                {(hoveredIndex === i || selectedIndex === i) ? (
                  <div className="text-center space-y-2">
                    <p className="text-primary font-semibold text-xs leading-tight animate-fade-in">
                      {philosophy.statement}
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
          <span>Click any cell to explore design philosophies</span>
          <span>{displayedPhilosophies.length} philosophies loaded</span>
        </div>
      </div>

      {/* Selected Philosophy Display */}
      {selectedIndex !== null && (
        <div className="mt-6 p-6 bg-background/90 backdrop-blur-md rounded-2xl border border-primary/20 shadow-lg animate-fade-in">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary text-sm font-bold">💭</span>
            </div>
            <div className="flex-1">
              <h3 className="text-primary font-semibold mb-2">Selected Philosophy</h3>
              <p className="text-foreground leading-relaxed">
                {displayedPhilosophies[selectedIndex]?.statement}
              </p>
              <button 
                onClick={() => setSelectedIndex(null)}
                className="mt-3 text-xs text-foreground hover:text-primary transition-colors"
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

export default InteractiveGrid;
