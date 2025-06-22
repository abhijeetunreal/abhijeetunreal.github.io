import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  items: string[];
  className?: string;
}

const Marquee: React.FC<MarqueeProps> = ({ items, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [repeatCount, setRepeatCount] = useState(2);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const contentWidth = contentRef.current.offsetWidth;
    if (contentWidth === 0) return;
    // Calculate how many times to repeat so content overflows container
    const minRepeats = Math.ceil(containerWidth / contentWidth) + 1;
    setRepeatCount(Math.max(2, minRepeats));
  }, [items]);

  // Repeat items as needed
  const repeatedItems = Array.from({ length: repeatCount }, () => items).flat();

  return (
    <div ref={containerRef} className={cn("relative w-full overflow-hidden group", className)}>
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused] py-4"
        ref={contentRef}
      >
        {repeatedItems.map((item, index) => (
          <div key={index} className="flex-shrink-0 mx-6 text-2xl font-semibold text-muted-foreground whitespace-nowrap">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
