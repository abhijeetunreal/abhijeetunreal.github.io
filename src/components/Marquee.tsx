import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Company {
  name: string;
  logo: string;
  darkLogo?: string; // Optional dark mode logo
}

interface MarqueeProps {
  items: (string | Company)[];
  className?: string;
  debug?: boolean; // Add debug prop for development
}

const Marquee: React.FC<MarqueeProps> = ({ items, className, debug = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [debugInfo, setDebugInfo] = useState<{
    containerWidth?: number;
    itemsCount?: number;
    isAutoScrolling?: boolean;
    isDragging?: boolean;
    velocity?: number;
  }>({});

  // Use refs for interaction variables to prevent re-renders (same as ProjectShowcase)
  const isDownRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const initialScrollLeftRef = useRef(0);
  const isAutoScrollingRef = useRef(true);
  const interactionTimeoutRef = useRef<NodeJS.Timeout>();
  const animationRef = useRef<number>();
  const velocityRef = useRef(0); // Track velocity for inertia
  const lastXRef = useRef(0); // Track last X position
  const lastTimeRef = useRef(0); // Track last time for velocity
  const inertiaAnimRef = useRef<number>(); // For inertia animation

  // Check for dark mode
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    // Initial check
    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    
    if (!container || !content || items.length === 0) return;

    const gap = 24; // 24px gap between items

    const scrollLoop = () => {
      if (isAutoScrollingRef.current && !isDownRef.current) {
        container.scrollLeft += 0.5;
      }

      // Check boundaries and reposition items for infinite loop (same as ProjectShowcase)
      const firstItem = content.children[0] as HTMLElement;
      if (firstItem) {
        const firstItemWidth = firstItem.offsetWidth + gap;
        if (container.scrollLeft >= firstItemWidth) {
          content.appendChild(firstItem);
          container.scrollLeft -= firstItemWidth;
          if (isDownRef.current) {
            initialScrollLeftRef.current -= firstItemWidth;
          }
        }
      }

      const lastItem = content.children[content.children.length - 1] as HTMLElement;
      if (lastItem) {
        const lastItemWidth = lastItem.offsetWidth + gap;
        if (container.scrollLeft <= 0) {
          content.insertBefore(lastItem, content.firstChild);
          container.scrollLeft += lastItemWidth;
          if (isDownRef.current) {
            initialScrollLeftRef.current += lastItemWidth;
          }
        }
      }
      
      animationRef.current = requestAnimationFrame(scrollLoop);
    };

    // --- INERTIA ANIMATION (same as ProjectShowcase) ---
    const startInertia = () => {
      cancelInertia();
      let velocity = velocityRef.current;
      const friction = 0.95; // Friction factor
      const minVelocity = 0.2; // Stop threshold
      function inertiaStep() {
        if (Math.abs(velocity) > minVelocity) {
          container.scrollLeft -= velocity;
          velocity *= friction;
          inertiaAnimRef.current = requestAnimationFrame(inertiaStep);
        } else {
          velocityRef.current = 0;
          inertiaAnimRef.current = undefined;
        }
      }
      inertiaStep();
    };
    const cancelInertia = () => {
      if (inertiaAnimRef.current) {
        cancelAnimationFrame(inertiaAnimRef.current);
        inertiaAnimRef.current = undefined;
      }
    };

    // --- INTERACTION HANDLERS (same as ProjectShowcase) ---
    const startInteraction = (e: MouseEvent | TouchEvent) => {
      isAutoScrollingRef.current = false;
      isDownRef.current = true;
      isDraggingRef.current = false;
      container.style.cursor = 'grabbing';
      const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
      startXRef.current = pageX - container.offsetLeft;
      initialScrollLeftRef.current = container.scrollLeft;
      lastXRef.current = pageX;
      lastTimeRef.current = performance.now();
      velocityRef.current = 0;
      cancelInertia();
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };

    const moveInteraction = (e: MouseEvent | TouchEvent) => {
      if (!isDownRef.current) return;
      const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
      const x = pageX - container.offsetLeft;
      const walk = x - startXRef.current;
      if (Math.abs(walk) > 5) {
        isDraggingRef.current = true;
      }
      if (isDraggingRef.current) {
        if (e.cancelable) e.preventDefault();
        container.scrollLeft = initialScrollLeftRef.current - walk;
        // --- Velocity calculation ---
        const now = performance.now();
        const dt = now - lastTimeRef.current;
        if (dt > 0) {
          velocityRef.current = (pageX - lastXRef.current) / dt * 16; // px per frame (assuming 60fps)
        }
        lastXRef.current = pageX;
        lastTimeRef.current = now;
      }
    };

    const endInteraction = () => {
      if (!isDownRef.current) return;
      isDownRef.current = false;
      container.style.cursor = 'grab';
      if (isDraggingRef.current && Math.abs(velocityRef.current) > 0.5) {
        startInertia();
      }
      interactionTimeoutRef.current = setTimeout(() => {
        isAutoScrollingRef.current = true;
      }, 2000);
    };

    const handleClick = (e: Event) => {
      if (isDraggingRef.current) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Mouse event listeners (same as ProjectShowcase)
    container.addEventListener('mousedown', startInteraction);
    container.addEventListener('mousemove', moveInteraction);
    container.addEventListener('mouseup', endInteraction);
    container.addEventListener('mouseleave', () => {
      endInteraction();
      container.style.cursor = 'grab';
    });

    // Touch event listeners (same as ProjectShowcase)
    container.addEventListener('touchstart', startInteraction, { passive: true });
    container.addEventListener('touchmove', moveInteraction, { passive: false });
    container.addEventListener('touchend', endInteraction);
    container.addEventListener('touchcancel', endInteraction);

    content.addEventListener('click', handleClick);

    // Start the continuous loop
    animationRef.current = requestAnimationFrame(scrollLoop);

    // Store debug information
    if (debug) {
      setDebugInfo({
        containerWidth: container.offsetWidth,
        itemsCount: items.length,
        isAutoScrolling: isAutoScrollingRef.current,
        isDragging: isDraggingRef.current,
        velocity: velocityRef.current
      });
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      container.removeEventListener('mousedown', startInteraction);
      container.removeEventListener('mousemove', moveInteraction);
      container.removeEventListener('mouseup', endInteraction);
      container.removeEventListener('mouseleave', endInteraction);
      container.removeEventListener('touchstart', startInteraction);
      container.removeEventListener('touchmove', moveInteraction);
      container.removeEventListener('touchend', endInteraction);
      container.removeEventListener('touchcancel', endInteraction);
      content.removeEventListener('click', handleClick);
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
      cancelInertia();
    };
  }, [items, debug]); // Empty dependency array since we're using refs

  const renderItem = (item: string | Company, index: number) => {
    if (typeof item === 'string') {
      return (
        <div 
          key={index} 
          className="flex-shrink-0 text-2xl font-semibold text-foreground whitespace-nowrap"
        >
          {item}
        </div>
      );
    } else {
      // Determine which logo to use based on theme
      const logoUrl = isDarkMode && item.darkLogo ? item.darkLogo : item.logo;
      
      return (
        <div 
          key={`${item.name}-${index}`} 
          className="flex-shrink-0 flex items-center justify-center p-4"
          style={{ width: '200px', height: '80px', minWidth: '200px' }}
        >
          <img 
            src={logoUrl} 
            alt={item.name}
            className="max-w-full max-h-full object-contain marquee-logo"
            style={{ maxWidth: '180px', maxHeight: '60px' }}
            onError={(e) => {
              // Fallback to text if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.parentElement?.querySelector('.fallback-text') as HTMLElement;
              if (fallback) {
                fallback.style.display = 'block';
                fallback.textContent = item.name;
              }
            }}
          />
          <div className="fallback-text text-lg font-semibold text-foreground whitespace-nowrap hidden">
            {item.name}
          </div>
        </div>
      );
    }
  };

  // Repeat items for infinite scroll (same as ProjectShowcase approach)
  const repeatedItems = Array.from({ length: 3 }, () => items).flat();

  return (
    <div className="space-y-2">
      {debug && (
        <div className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">
          <div><strong>Debug Info:</strong></div>
          <div>Container: {debugInfo.containerWidth}px</div>
          <div>Items Count: {debugInfo.itemsCount}</div>
          <div>Auto Scrolling: {debugInfo.isAutoScrolling ? 'Yes' : 'No'}</div>
          <div>Dragging: {debugInfo.isDragging ? 'Yes' : 'No'}</div>
          <div>Velocity: {debugInfo.velocity?.toFixed(2)}</div>
          <div>Theme: {isDarkMode ? 'Dark' : 'Light'}</div>
        </div>
      )}
      
      <div 
        ref={containerRef} 
        className={cn("relative w-full overflow-hidden cursor-grab select-none", className)}
        onMouseEnter={() => {
          isAutoScrollingRef.current = false;
        }}
        onMouseLeave={() => {
          isAutoScrollingRef.current = true;
        }}
      >
        <div
          ref={contentRef}
          className="flex w-max py-4 gap-6"
          style={{ width: 'fit-content' }}
        >
          {repeatedItems.map((item, index) => renderItem(item, index))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
