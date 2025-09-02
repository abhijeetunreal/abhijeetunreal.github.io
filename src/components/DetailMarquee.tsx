import React, { useMemo } from 'react';
import Marquee from './Marquee';
import { cn } from '@/lib/utils';

export type DetailMarqueeItem = string | { image: string };

export interface DetailMarqueeProps {
  className?: string;
  leftImage: string;
  leftAlt?: string;
  items: DetailMarqueeItem[];
}

const DetailMarquee: React.FC<DetailMarqueeProps> = ({ className, leftImage, leftAlt, items }) => {
  const marqueeItems = useMemo(() => {
    return items.map((it) => {
      const url = typeof it === 'string' ? it : it.image;
      return { name: '', logo: url };
    });
  }, [items]);

  return (
    <div className={cn('w-full my-8', className)}>
      <div className="flex items-center gap-0">
        <div className="w-auto">
          <div className="w-36 sm:w-48 md:w-64 lg:w-80">
            <div className="aspect-[3/4] rounded-none overflow-hidden">
              <img src={leftImage} alt={leftAlt || 'Marquee left'} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0 relative">
          <Marquee
            items={marqueeItems}
            className="py-2"
            variant="card"
          />
          <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-background to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default DetailMarquee;


