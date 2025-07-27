import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  items: string[];
  className?: string;
  debug?: boolean; // Add debug prop for development
}

const Marquee: React.FC<MarqueeProps> = ({ items, className, debug = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [repeatCount, setRepeatCount] = useState(2);
  const [itemSpacing, setItemSpacing] = useState(24); // Default spacing in pixels
  const [animationDuration, setAnimationDuration] = useState(40); // Default duration in seconds
  const [isPaused, setIsPaused] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    if (!containerRef.current || items.length === 0) return;
    
    const calculateOptimalSpacing = () => {
      const containerWidth = containerRef.current!.offsetWidth;
      
      // Create a temporary element to measure text width
      const tempElement = document.createElement('div');
      tempElement.className = 'text-2xl font-semibold whitespace-nowrap absolute invisible';
      document.body.appendChild(tempElement);
      
      // Calculate total width of all items
      let totalItemWidth = 0;
      const itemWidths: number[] = [];
      items.forEach(item => {
        tempElement.textContent = item;
        const width = tempElement.offsetWidth;
        itemWidths.push(width);
        totalItemWidth += width;
      });
      
      // Remove temporary element
      document.body.removeChild(tempElement);
      
      // Calculate optimal spacing to fill the container
      const availableSpace = containerWidth - totalItemWidth;
      const spacingBetweenItems = Math.max(24, availableSpace / (items.length + 1)); // Minimum 24px spacing
      
      setItemSpacing(spacingBetweenItems);
      
      // Calculate how many times to repeat so content overflows container
      const totalContentWidth = totalItemWidth + (spacingBetweenItems * (items.length - 1));
      const minRepeats = Math.ceil((containerWidth * 2) / totalContentWidth) + 1;
      setRepeatCount(Math.max(2, minRepeats));
      
      // Calculate animation duration based on content length
      // Base duration of 40s for a full screen width, adjust based on content length
      const baseDuration = 40;
      const contentRatio = totalContentWidth / containerWidth;
      const adjustedDuration = Math.max(20, Math.min(60, baseDuration * contentRatio));
      setAnimationDuration(adjustedDuration);
      
      // Store debug information
      if (debug) {
        setDebugInfo({
          containerWidth,
          totalItemWidth,
          itemWidths,
          availableSpace,
          spacingBetweenItems,
          totalContentWidth,
          repeatCount: Math.max(2, minRepeats),
          animationDuration: adjustedDuration,
          contentRatio
        });
      }
    };

    // Initial calculation
    calculateOptimalSpacing();
    
    // Recalculate on window resize
    const handleResize = () => {
      calculateOptimalSpacing();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [items, debug]);

  // Repeat items as needed
  const repeatedItems = Array.from({ length: repeatCount }, () => items).flat();

  return (
    <div className="space-y-2">
      {debug && (
        <div className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">
          <div><strong>Debug Info:</strong></div>
          <div>Container: {debugInfo.containerWidth}px</div>
          <div>Items: {debugInfo.itemWidths?.join(', ')}px</div>
          <div>Total Items: {debugInfo.totalItemWidth}px</div>
          <div>Available Space: {debugInfo.availableSpace}px</div>
          <div>Spacing: {debugInfo.spacingBetweenItems}px</div>
          <div>Total Content: {debugInfo.totalContentWidth}px</div>
          <div>Repeats: {debugInfo.repeatCount}</div>
          <div>Duration: {debugInfo.animationDuration}s</div>
          <div>Paused: {isPaused ? 'Yes' : 'No'}</div>
        </div>
      )}
      
      <div 
        ref={containerRef} 
        className={cn("relative w-full overflow-hidden", className)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="flex w-max py-4"
          ref={contentRef}
          style={{
            gap: `${itemSpacing}px`,
            animationName: 'marquee',
            animationDuration: `${animationDuration}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        >
          {repeatedItems.map((item, index) => (
            <div 
              key={index} 
                              className="flex-shrink-0 text-2xl font-semibold text-foreground whitespace-nowrap"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
