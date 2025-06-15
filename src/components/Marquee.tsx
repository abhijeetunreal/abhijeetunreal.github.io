
import React from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  items: string[];
  className?: string;
}

const Marquee: React.FC<MarqueeProps> = ({ items, className }) => {
  const content = [...items, ...items]; // Duplicate for seamless loop

  return (
    <div className={cn("relative w-full overflow-hidden group", className)}>
      <div className="flex animate-marquee group-hover:[animation-play-state:paused] py-4">
        {content.map((item, index) => (
          <div key={index} className="flex-shrink-0 mx-6 text-2xl font-semibold text-muted-foreground whitespace-nowrap">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
