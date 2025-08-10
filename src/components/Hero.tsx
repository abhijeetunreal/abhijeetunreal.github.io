import React, { useEffect, useRef, useState } from 'react';
import content from '@/data/content.json';
import { ThemeToggle } from './ThemeToggle';
import { slugify } from '@/lib/utils';

interface CardData {
  title: string;
  imageUrl: string;
  alt: string;
  link: string;
  slug: string;
}

interface HeroProps {
  onGoHome?: () => void;
  onSelectProject?: (slug: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onGoHome, onSelectProject }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollerInnerRef = useRef<HTMLDivElement>(null);
  
  // Use refs for interaction variables to prevent re-renders
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

  // State for current navigation item
  // Convert projects from content.json to card data format
  const cardData: CardData[] = content.projects.map(project => ({
    title: project.title.toUpperCase(),
    imageUrl: project.cardImage,
    alt: project.description,
    link: '#',
    slug: slugify(project.title)
  }));

  const createCard = (item: CardData) => (
    <a 
      href={item.link} 
      className="card-link" 
      draggable={false} 
      key={item.title}
      onClick={(e) => {
        e.preventDefault();
        // Only trigger if it's a genuine click (not a drag)
        if (!isDraggingRef.current && onSelectProject) {
          onSelectProject(item.slug);
        }
      }}
    >
      <div className="flex-shrink-0 w-48 sm:w-56 md:w-64 lg:w-80">
        <p className="text-xs font-bold mb-2 tracking-wider">{item.title}</p>
        <div className="aspect-[3/4] rounded-lg overflow-hidden">
          <img 
            src={item.imageUrl} 
            alt={item.alt} 
            className="w-full h-full object-cover" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'https://placehold.co/600x800/000000/FFFFFF?text=Image';
            }}
            draggable={false}
          />
        </div>
      </div>
    </a>
  );

  useEffect(() => {
    const scroller = scrollerRef.current;
    const scrollerInner = scrollerInnerRef.current;
    
    if (!scroller || !scrollerInner) return;

    const gap = 16; // 1rem = 16px

    const scrollLoop = () => {
      if (isAutoScrollingRef.current && !isDownRef.current) {
        scroller.scrollLeft += 0.5;
      }

      // Check boundaries and reposition cards for infinite loop
      const firstCard = scrollerInner.children[0] as HTMLElement;
      if (firstCard) {
        const firstCardWidth = firstCard.offsetWidth + gap;
        if (scroller.scrollLeft >= firstCardWidth) {
          scrollerInner.appendChild(firstCard);
          scroller.scrollLeft -= firstCardWidth;
          if (isDownRef.current) {
            initialScrollLeftRef.current -= firstCardWidth;
          }
        }
      }

      const lastCard = scrollerInner.children[scrollerInner.children.length - 1] as HTMLElement;
      if (lastCard) {
        const lastCardWidth = lastCard.offsetWidth + gap;
        if (scroller.scrollLeft <= 0) {
          scrollerInner.insertBefore(lastCard, scrollerInner.firstChild);
          scroller.scrollLeft += lastCardWidth;
          if (isDownRef.current) {
            initialScrollLeftRef.current += lastCardWidth;
          }
        }
      }
      
      animationRef.current = requestAnimationFrame(scrollLoop);
    };

    // --- INERTIA ANIMATION ---
    const startInertia = () => {
      cancelInertia();
      let velocity = velocityRef.current;
      const friction = 0.95; // Friction factor
      const minVelocity = 0.2; // Stop threshold
      function inertiaStep() {
        if (Math.abs(velocity) > minVelocity) {
          scroller.scrollLeft -= velocity;
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

    // --- INTERACTION HANDLERS ---
    const startInteraction = (e: MouseEvent | TouchEvent) => {
      isAutoScrollingRef.current = false;
      isDownRef.current = true;
      isDraggingRef.current = false;
      scroller.classList.add('active');
      const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
      startXRef.current = pageX - scroller.offsetLeft;
      initialScrollLeftRef.current = scroller.scrollLeft;
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
      const x = pageX - scroller.offsetLeft;
      const walk = x - startXRef.current;
      if (Math.abs(walk) > 5) {
        isDraggingRef.current = true;
      }
      if (isDraggingRef.current) {
        if (e.cancelable) e.preventDefault();
        scroller.scrollLeft = initialScrollLeftRef.current - walk;
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
      scroller.classList.remove('active');
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

    // Mouse event listeners
    scroller.addEventListener('mousedown', startInteraction);
    scroller.addEventListener('mousemove', moveInteraction);
    scroller.addEventListener('mouseup', endInteraction);
    scroller.addEventListener('mouseleave', endInteraction);

    // Touch event listeners
    scroller.addEventListener('touchstart', startInteraction, { passive: true });
    scroller.addEventListener('touchmove', moveInteraction, { passive: false });
    scroller.addEventListener('touchend', endInteraction);
    scroller.addEventListener('touchcancel', endInteraction);

    scrollerInner.addEventListener('click', handleClick);

    // Start the continuous loop
    animationRef.current = requestAnimationFrame(scrollLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      scroller.removeEventListener('mousedown', startInteraction);
      scroller.removeEventListener('mousemove', moveInteraction);
      scroller.removeEventListener('mouseup', endInteraction);
      scroller.removeEventListener('mouseleave', endInteraction);
      scroller.removeEventListener('touchstart', startInteraction);
      scroller.removeEventListener('touchmove', moveInteraction);
      scroller.removeEventListener('touchend', endInteraction);
      scroller.removeEventListener('touchcancel', endInteraction);
      scrollerInner.removeEventListener('click', handleClick);
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
      cancelInertia();
    };
  }, []); // Empty dependency array since we're using refs

  return (
    <div className="hero-section h-screen flex flex-col">
      {/* Header Navigation */}
      <header className="w-full p-6 sm:p-8">
        <nav className="flex justify-center sm:justify-end">
          <ul className="flex items-center space-x-6 md:space-x-8 text-sm font-bold tracking-wider">
            <li>
              <a 
                href="#" 
                onClick={() => {
                  // setCurrentNav('HOME'); // Removed as per edit hint
                  onGoHome?.();
                }} 
                className={`hover:text-gray-400 transition-colors duration-300 ${/* currentNav === 'HOME' ? 'underline font-bold' : */ ''}`}
              >
                HOME
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                // onClick={() => setCurrentNav('ABOUT')} // Removed as per edit hint
                className={`hover:text-gray-400 transition-colors duration-300 ${/* currentNav === 'ABOUT' ? 'underline font-bold' : */ ''}`}
              >
                ABOUT
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                // onClick={() => setCurrentNav('CONTACT')} // Removed as per edit hint
                className={`hover:text-gray-400 transition-colors duration-300 ${/* currentNav === 'CONTACT' ? 'underline font-bold' : */ ''}`}
              >
                CONTACT
              </a>
            </li>
            <li><ThemeToggle /></li>
          </ul>
        </nav>
      </header>

      {/* Main Content (Logo) */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-8 pb-4 sm:pb-0">
        <h1 
          className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onGoHome}
        >
            {content.name}<sup className="text-2xl sm:text-3xl md:text-4xl -top-8 sm:-top-20  ">▲</sup>
        </h1>
      </main>

      {/* Infinite Scroller Section */}
      <div 
        ref={scrollerRef}
        className="scroller pb-4 sm:pb-6 md:pb-8 w-full max-w-full overflow-hidden cursor-grab select-none"
      >
        <div 
          ref={scrollerInnerRef}
          className="scroller__inner flex flex-nowrap gap-4 w-max"
        >
          {cardData.map((item, index) => createCard(item))}
        </div>
      </div>
    </div>
  );
};

export default Hero; 