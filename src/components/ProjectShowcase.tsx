import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { slugify } from '@/lib/utils';
import { Project } from '@/types/content';

type ProjectShowcaseProps = {
  projects: Project[];
  tags: string[];
  onSelectProject: (slug: string) => void;
};

const ProjectShowcase = ({ projects, tags, onSelectProject }: ProjectShowcaseProps) => {
  const [activeTag, setActiveTag] = useState<string>('All');
  const tagScrollRef = useRef<HTMLDivElement>(null);
  const projectsContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<number | null>(null);
  const isUserInteractingRef = useRef(false);
  const isPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const scrollStartRef = useRef(0);
  const touchStartTimeRef = useRef(0);
  const hasMovedRef = useRef(false);
  const scrollSpeed = 0.3; // pixels per frame (reduced for smoother movement)
  const pauseDelay = 3000; // ms to wait before resuming auto-scroll
  const repositionThreshold = 100; // pixels before repositioning

  const filteredProjects = useMemo(() => {
    if (activeTag === 'All') {
      return projects;
    }
    return projects.filter(p => p.tags.includes(activeTag));
  }, [activeTag, projects]);

  const allTagsWithAll = useMemo(() => ['All', ...tags], [tags]);

  // Optimized auto-scroll functionality using CSS transforms
  const startAutoScroll = () => {
    if (autoScrollRef.current || isPausedRef.current) return;
    
    const container = projectsContainerRef.current;
    if (!container) return;

    // Get current position from transform, or start from 0
    let currentPosition = parseFloat(container.style.transform.replace('translateX(-', '').replace('px)', '') || '0');
    const containerWidth = container.scrollWidth / 4; // We now have 4 sets for optimized buffer

    const animate = () => {
      if (isUserInteractingRef.current || isPausedRef.current || isDraggingRef.current) {
        autoScrollRef.current = requestAnimationFrame(animate);
        return;
      }

      currentPosition += scrollSpeed;
      
      // Smoother infinite loop with better repositioning
      const maxScroll = containerWidth * 4; // Allow scrolling through 4 sets before repositioning
      
      // Only reposition if we go way beyond the buffer - with smoother transition
      if (currentPosition >= maxScroll) {
        currentPosition = currentPosition - (containerWidth * 2);
        // Use smooth repositioning helper
        smoothReposition(container, currentPosition);
      } else {
        container.style.transform = `translateX(-${currentPosition}px)`;
      }
      
      autoScrollRef.current = requestAnimationFrame(animate);
    };
    
    autoScrollRef.current = requestAnimationFrame(animate);
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  };

  const pauseAutoScroll = () => {
    isPausedRef.current = true;
    stopAutoScroll();
  };

  const resumeAutoScroll = () => {
    isPausedRef.current = false;
    // Don't reset position, just start auto-scroll from current position
    startAutoScroll();
  };

  const handleUserInteraction = () => {
    isUserInteractingRef.current = true;
    pauseAutoScroll();
    
    // Resume auto-scroll after delay
    setTimeout(() => {
      isUserInteractingRef.current = false;
      resumeAutoScroll();
    }, pauseDelay);
  };

  // Helper function to handle infinite scroll position with smoother repositioning
  const getInfinitePosition = (position: number, containerWidth: number) => {
    // Keep position within bounds with smoother repositioning
    if (position < 0) {
      return containerWidth * 3 + (position % containerWidth);
    } else if (position >= containerWidth * 4) {
      return position % containerWidth;
    }
    return position;
  };

  // Helper function for smooth repositioning
  const smoothReposition = (container: HTMLElement, newPosition: number) => {
    // Temporarily disable transitions for instant repositioning
    container.style.transition = 'none';
    container.style.transform = `translateX(-${newPosition}px)`;
    
    // Force reflow to ensure the change is applied
    container.offsetHeight;
    
    // Re-enable transitions for smooth future movements
    requestAnimationFrame(() => {
      container.style.transition = 'transform 0.1s ease-out';
    });
  };

  // Mouse wheel scroll handler using the same approach as tag chips
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const container = projectsContainerRef.current;
    if (!container) return;

    // Pause auto-scroll and mark user interaction
    handleUserInteraction();

    // Get current position
    const currentPosition = parseFloat(container.style.transform.replace('translateX(-', '').replace('px)', '') || '0');
    const containerWidth = container.scrollWidth / 4; // We now have 4 sets for optimized buffer
    
    // Calculate new position based on wheel direction with smoother movement
    let newPosition = currentPosition;
    
    // Handle both vertical and horizontal wheel events with reduced sensitivity
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      // Vertical wheel - convert to horizontal movement with smoother scaling
      newPosition = currentPosition - e.deltaY * 1.5;
    } else {
      // Horizontal wheel (trackpad) - use directly with smoother scaling
      newPosition = currentPosition - e.deltaX * 1.5;
    }
    
    // Handle infinite scroll with smoother repositioning
    let finalPosition = newPosition;
    
    // Use a much larger buffer to prevent frequent repositioning
    const maxScroll = containerWidth * 4; // Allow scrolling through 4 sets before any repositioning
    
    // Only reposition if we go way beyond the buffer
    if (newPosition >= maxScroll) {
      // Jump back to the middle set (set 2) to continue seamless scrolling
      finalPosition = newPosition - (containerWidth * 2);
    } else if (newPosition < 0) {
      // Jump to the middle set from the other direction
      finalPosition = newPosition + (containerWidth * 2);
    }
    
    // Apply the transform with smooth transition
    container.style.transition = 'transform 0.1s ease-out';
    container.style.transform = `translateX(-${finalPosition}px)`;
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    
    // Get current position from transform
    const container = projectsContainerRef.current;
    if (container) {
      scrollStartRef.current = parseFloat(container.style.transform.replace('translateX(-', '').replace('px)', '') || '0');
    }
    
    // Change cursor to grabbing
    if (projectsContainerRef.current) {
      projectsContainerRef.current.style.cursor = 'grabbing';
    }
    
    handleUserInteraction();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const container = projectsContainerRef.current;
    if (!container) return;

    const deltaX = dragStartRef.current.x - e.clientX;
    const newPosition = scrollStartRef.current + deltaX;
    const containerWidth = container.scrollWidth / 4; // We now have 4 sets for optimized buffer
    
    // Handle infinite scroll with smoother repositioning
    let finalPosition = newPosition;
    
    // Use a much larger buffer to prevent frequent repositioning
    const maxScroll = containerWidth * 4; // Allow scrolling through 4 sets before any repositioning
    
    // Only reposition if we go way beyond the buffer
    if (newPosition >= maxScroll) {
      // Jump back to the middle set (set 2) to continue seamless scrolling
      finalPosition = newPosition - (containerWidth * 2);
    } else if (newPosition < 0) {
      // Jump to the middle set from the other direction
      finalPosition = newPosition + (containerWidth * 2);
    }
    
    // Apply transform without transition during drag for immediate response
    container.style.transition = 'none';
    container.style.transform = `translateX(-${finalPosition}px)`;
  };

  const handleMouseUp = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    isDraggingRef.current = false;
    
    // Reset cursor and restore transitions
    if (projectsContainerRef.current) {
      projectsContainerRef.current.style.cursor = 'grab';
      projectsContainerRef.current.style.transition = 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
    }
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    // Don't prevent default on mobile to allow vertical scrolling
    e.stopPropagation();
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    touchStartTimeRef.current = Date.now();
    dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    
    // Get current position from transform
    const container = projectsContainerRef.current;
    if (container) {
      scrollStartRef.current = parseFloat(container.style.transform.replace('translateX(-', '').replace('px)', '') || '0');
    }
    
    handleUserInteraction();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    
    const container = projectsContainerRef.current;
    if (!container) return;

    const deltaX = dragStartRef.current.x - e.touches[0].clientX;
    const deltaY = Math.abs(e.touches[0].clientY - dragStartRef.current.y);
    
    // Check if we've moved enough to consider it a drag
    if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
      hasMovedRef.current = true;
    }
    
    // Only handle horizontal scrolling if the movement is more horizontal than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
      e.stopPropagation();
      
      const newPosition = scrollStartRef.current + deltaX;
      const containerWidth = container.scrollWidth / 4; // We now have 4 sets for optimized buffer
      
      // Handle infinite scroll with smoother repositioning
      let finalPosition = newPosition;
      
      // Use a much larger buffer to prevent frequent repositioning
      const maxScroll = containerWidth * 4; // Allow scrolling through 4 sets before any repositioning
      
      // Only reposition if we go way beyond the buffer
      if (newPosition >= maxScroll) {
        // Jump back to the middle set (set 2) to continue seamless scrolling
        finalPosition = newPosition - (containerWidth * 2);
      } else if (newPosition < 0) {
        // Jump to the middle set from the other direction
        finalPosition = newPosition + (containerWidth * 2);
      }
      
      // Apply transform without transition during touch for immediate response
      container.style.transition = 'none';
      container.style.transform = `translateX(-${finalPosition}px)`;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    
    // Check if this was a tap (not a drag)
    const touchDuration = Date.now() - touchStartTimeRef.current;
    const isTap = !hasMovedRef.current && touchDuration < 300;
    
    if (isTap) {
      // Don't prevent default, let the click event fire naturally
      // Just reset the dragging state
      isDraggingRef.current = false;
      hasMovedRef.current = false;
      return;
    }
    
    // Restore transitions after touch interaction
    if (projectsContainerRef.current) {
      projectsContainerRef.current.style.transition = 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    isDraggingRef.current = false;
    hasMovedRef.current = false;
  };

  // Start auto-scroll when component mounts or projects change
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      startAutoScroll();
    }, 100);
    
    return () => {
      clearTimeout(timer);
      stopAutoScroll();
    };
  }, [filteredProjects]);

  // Add aggressive event prevention
  useEffect(() => {
    const container = projectsContainerRef.current;
    if (!container) return;

    const handleWheelEvent = (e: WheelEvent) => {
      // Only handle if it's a vertical scroll
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        e.stopPropagation();
        
        // Trigger the React wheel handler
        const reactEvent = {
          preventDefault: () => e.preventDefault(),
          stopPropagation: () => e.stopPropagation(),
          deltaY: e.deltaY,
          deltaX: e.deltaX
        } as React.WheelEvent;
        
        handleWheel(reactEvent);
      }
    };

    // Add wheel event listener with passive: false
    container.addEventListener('wheel', handleWheelEvent, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheelEvent);
    };
  }, []);

  // Global mouse up listener for drag
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDraggingRef.current) {
        handleMouseUp();
      }
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        handleMouseMove(e as any);
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mousemove', handleGlobalMouseMove);
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, []);

  useEffect(() => {
    const el = tagScrollRef.current;
    if (!el) return;

    // Preload images for smoother experience
    const preloadImages = () => {
      const images = Array.from(document.querySelectorAll('.project-card-image'));
      images.forEach((img: any) => {
        if (img && img.dataset.src) {
          const image = new window.Image();
          image.src = img.dataset.src;
        }
      });
    };
    setTimeout(preloadImages, 0);

    // Smooth tag scrolling with momentum
    let animationFrame: number;
    let startTime: number | null = null;
    let startScroll: number = 0;
    let targetScroll: number = 0;
    let duration: number = 600;
    let isAnimating = false;

    function easeOutCubic(t: number) {
      return 1 - Math.pow(1 - t, 3);
    }

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeOutCubic(progress);
      el.scrollLeft = startScroll + (targetScroll - startScroll) * ease;
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        isAnimating = false;
        startTime = null;
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth > el.clientWidth && e.deltaY !== 0) {
        e.preventDefault();
        if (isAnimating) {
          startScroll = el.scrollLeft;
          targetScroll += e.deltaY * 2;
        } else {
          startScroll = el.scrollLeft;
          targetScroll = el.scrollLeft + e.deltaY * 2;
        }
        targetScroll = Math.max(0, Math.min(targetScroll, el.scrollWidth - el.clientWidth));
        startTime = null;
        isAnimating = true;
        cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  // Memoized Badge for tags
  const MemoBadge = React.memo(Badge);

  // Memoized ProjectCard component for performance
  const ProjectCard = React.memo(({ project, onSelectProject, index }: { project: Project, onSelectProject: (slug: string) => void, index: number }) => {
    const handleCardClick = (e: React.MouseEvent) => {
      // Only handle click if we haven't been dragging
      if (!hasMovedRef.current) {
        onSelectProject(slugify(project.title));
      }
    };

    return (
      <div
        onClick={handleCardClick}
        className="block hover:no-underline group cursor-pointer project-card"
        key={project.title}
      >
      <Card className="h-full flex flex-col animate-fade-in border-accent group-hover:border-primary transition-colors overflow-hidden min-w-[300px] max-w-[300px] flex-shrink-0" style={{ animationDelay: `${index * 50}ms` }}>
        {project.cardImage && (
          <div
            className="h-64 bg-cover bg-center relative project-card-image"
            style={{ backgroundImage: `url(${project.cardImage})` }}
            data-src={project.cardImage}
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          </div>
        )}
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-test">{project.title}</CardTitle>
        </CardHeader>
        <CardContent className="mt-auto pt-0">
          <CardDescription className="text-sm mb-4 text-foreground">
            {project.description.length > 100 
              ? `${project.description.substring(0, 100)}...` 
              : project.description
            }
          </CardDescription>
          <Button 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onSelectProject(slugify(project.title));
            }}
          >
            Learn More
          </Button>
        </CardContent>
      </Card>
    </div>
  );
  });

  return (
    <div>
      <div
        ref={tagScrollRef}
        className="flex items-center gap-2 mb-8 overflow-x-auto hide-scrollbar px-2 -mx-2 whitespace-nowrap"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {allTagsWithAll.map(tag => (
          <Button
            key={tag}
            variant={activeTag === tag ? 'default' : 'outline'}
            onClick={() => setActiveTag(tag)}
            className="rounded-full px-4 py-2 text-sm mx-1 whitespace-nowrap"
          >
            {tag}
          </Button>
        ))}
      </div>
      
      {/* Optimized horizontal scrolling projects container */}
      <div 
        className="relative overflow-hidden project-card-container"
      >
        <div 
          ref={projectsContainerRef}
          className="flex gap-6 pb-4 will-change-transform smooth-scroll cursor-grab select-none"
          style={{ 
            transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            width: 'fit-content'
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleUserInteraction}
          onMouseLeave={() => {
            // Don't immediately resume, let the timeout handle it for smoother transition
            isUserInteractingRef.current = false;
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Duplicate projects for smooth infinite effect (optimized for smoother experience) */}
          {[...filteredProjects, ...filteredProjects, ...filteredProjects, ...filteredProjects].map((project, index) => (
            <ProjectCard 
              project={project} 
              onSelectProject={onSelectProject} 
              index={index} 
              key={`${project.title}-${index}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectShowcase;
