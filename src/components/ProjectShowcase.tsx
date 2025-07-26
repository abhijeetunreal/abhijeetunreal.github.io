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
  const projectsScrollRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<number | null>(null);
  const isUserInteractingRef = useRef(false);
  const scrollSpeed = 1; // pixels per frame
  const pauseDelay = 3000; // ms to wait before resuming auto-scroll

  const filteredProjects = useMemo(() => {
    if (activeTag === 'All') {
      return projects;
    }
    return projects.filter(p => p.tags.includes(activeTag));
  }, [activeTag, projects]);

  const allTagsWithAll = useMemo(() => ['All', ...tags], [tags]);

  // Auto-scroll functionality
  const startAutoScroll = () => {
    if (autoScrollRef.current) return;
    
    const scrollContainer = projectsScrollRef.current;
    if (!scrollContainer) return;

    const animate = () => {
      if (isUserInteractingRef.current) {
        autoScrollRef.current = requestAnimationFrame(animate);
        return;
      }

      scrollContainer.scrollLeft += scrollSpeed;
      
      // Smooth infinite loop - reset when reaching the end of first set
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      const firstSetWidth = maxScroll / 3; // We have 3 sets now
      
      if (scrollContainer.scrollLeft >= firstSetWidth * 2) {
        // Smoothly reset to the middle set (which is identical to the first set)
        scrollContainer.scrollLeft = firstSetWidth;
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

  const handleUserInteraction = () => {
    isUserInteractingRef.current = true;
    stopAutoScroll();
    
    // Resume auto-scroll after delay
    setTimeout(() => {
      isUserInteractingRef.current = false;
      startAutoScroll();
    }, pauseDelay);
  };

  const handleScroll = () => {
    const scrollContainer = projectsScrollRef.current;
    if (!scrollContainer) return;

    // Smooth infinite loop for manual scrolling
    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    const firstSetWidth = maxScroll / 3; // We have 3 sets now
    
    if (scrollContainer.scrollLeft >= firstSetWidth * 2) {
      // Reset to middle set for seamless loop
      scrollContainer.scrollLeft = firstSetWidth;
    } else if (scrollContainer.scrollLeft <= 0) {
      // Reset to middle set when scrolling backwards
      scrollContainer.scrollLeft = firstSetWidth;
    }
  };

  // Start auto-scroll when component mounts or projects change
  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [filteredProjects]);

  useEffect(() => {
    const el = tagScrollRef.current;
    if (!el) return;

    // Preload all images in the project cards for smoother experience
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

    let animationFrame: number;
    let startTime: number | null = null;
    let startScroll: number = 0;
    let targetScroll: number = 0;
    let duration: number = 600; // ms, adjust for more/less inertia
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
          // If animating, use current scroll as new start
          startScroll = el.scrollLeft;
          targetScroll += e.deltaY * 2; // adjust multiplier for sensitivity
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
  const ProjectCard = React.memo(({ project, onSelectProject, index }: { project: Project, onSelectProject: (slug: string) => void, index: number }) => (
    <div
      onClick={() => onSelectProject(slugify(project.title))}
      className="block hover:no-underline group cursor-pointer"
      key={project.title}
    >
      <Card className="h-full flex flex-col animate-fade-in border-accent group-hover:border-primary transition-colors overflow-hidden min-w-[300px]" style={{ animationDelay: `${index * 100}ms` }}>
        {project.cardImage && (
          <div
            className="h-48 bg-cover bg-center relative project-card-image"
            style={{ backgroundImage: `url(${project.cardImage})` }}
            data-src={project.cardImage}
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          </div>
        )}
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="mt-auto pt-4">
          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <MemoBadge key={tag} variant="secondary">{tag}</MemoBadge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  ));

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
      
      {/* Horizontal scrolling projects container */}
      <div className="horizontal-scroll-container">
        <div 
          ref={projectsScrollRef}
          className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 auto-scroll"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth'
          }}
          onTouchStart={handleUserInteraction}
          onMouseDown={handleUserInteraction}
          onWheel={handleUserInteraction}
          onScroll={(e) => {
            handleUserInteraction();
            handleScroll();
          }}
        >
          {/* Triplicate projects for smooth infinite effect */}
          {[...filteredProjects, ...filteredProjects, ...filteredProjects].map((project, index) => (
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
