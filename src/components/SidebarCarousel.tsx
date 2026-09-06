import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

interface Props { items: string[]; autoplayInterval?: number }

const SidebarCarousel: React.FC<Props> = ({ items, autoplayInterval = 4000 }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const hoverRef = useRef(false);
  const autoplayTimer = useRef<number | null>(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    const play = () => {
      if (hoverRef.current) return;
      emblaApi.scrollNext();
    };
    autoplayTimer.current = window.setInterval(play, autoplayInterval) as unknown as number;
    return () => {
      if (autoplayTimer.current) window.clearInterval(autoplayTimer.current);
    };
  }, [emblaApi, autoplayInterval]);

  const scrollTo = useCallback((idx: number) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(idx);
  }, [emblaApi]);

  return (
    <div
      className="relative"
      onMouseEnter={() => { hoverRef.current = true; }}
      onMouseLeave={() => { hoverRef.current = false; }}
    >
      <div className="overflow-hidden rounded-md">
        <div className="flex" ref={emblaRef as any}>
          {items.map((src, i) => (
            <div key={i} className="flex-shrink-0 w-full">
              <img src={src} alt={`slide-${i}`} className="w-full h-40 object-cover rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-2 flex gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-all ${i === selectedIndex ? 'bg-white scale-110 dark:bg-white' : 'bg-white/60 dark:bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SidebarCarousel;
