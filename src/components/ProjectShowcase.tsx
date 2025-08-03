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

  const filteredProjects = useMemo(() => {
    if (activeTag === 'All') {
      return projects;
    }
    return projects.filter(p => p.tags.includes(activeTag));
  }, [activeTag, projects]);

  const allTagsWithAll = useMemo(() => ['All', ...tags], [tags]);

  // Mouse drag handlers for horizontal scroll
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const scrollStartRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    if (projectsContainerRef.current) {
      scrollStartRef.current = projectsContainerRef.current.scrollLeft;
      projectsContainerRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    if (projectsContainerRef.current) {
      const dx = dragStartXRef.current - e.clientX;
      projectsContainerRef.current.scrollLeft = scrollStartRef.current + dx;
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    if (projectsContainerRef.current) {
      projectsContainerRef.current.style.cursor = 'grab';
    }
  };

  // Touch handlers for mobile
  const touchStartXRef = useRef(0);
  const touchScrollStartRef = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (projectsContainerRef.current) {
      touchStartXRef.current = e.touches[0].clientX;
      touchScrollStartRef.current = projectsContainerRef.current.scrollLeft;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (projectsContainerRef.current) {
      const dx = touchStartXRef.current - e.touches[0].clientX;
      projectsContainerRef.current.scrollLeft = touchScrollStartRef.current + dx;
    }
  };

  useEffect(() => {
    const container = projectsContainerRef.current;
    if (!container) return;
    const handleMouseLeave = () => {
      isDraggingRef.current = false;
      container.style.cursor = 'grab';
    };
    container.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Memoized Badge for tags
  const MemoBadge = React.memo(Badge);

  // Memoized ProjectCard component for performance
  const ProjectCard = React.memo(({ project, onSelectProject, index }: { project: Project, onSelectProject: (slug: string) => void, index: number }) => {
    const handleCardClick = (e: React.MouseEvent) => {
      onSelectProject(slugify(project.title));
    };
    return (
      <div
        onClick={handleCardClick}
        className="block hover:no-underline group cursor-pointer project-card"
        key={project.title}
      >
        <Card className="h-full flex flex-col animate-fade-in border-accent group-hover:border-primary transition-colors overflow-hidden min-w-[200px] max-w-[200px] md:min-w-[250px] md:max-w-[250px] flex-shrink-0" style={{ animationDelay: `${index * 50}ms` }}>
          {project.cardImage && (
            <div
              className="h-32 md:h-40 bg-cover bg-center relative project-card-image"
              style={{ backgroundImage: `url(${project.cardImage})` }}
              data-src={project.cardImage}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            </div>
          )}
          <CardHeader className="pb-2 px-3 pt-3">
            <CardTitle className="text-sm md:text-base font-test">{project.title}</CardTitle>
          </CardHeader>
          <CardContent className="mt-auto pt-0 px-3 pb-3">
            <CardDescription className="text-xs md:text-sm mb-3 text-foreground">
              {project.description.length > 60 
                ? `${project.description.substring(0, 60)}...` 
                : project.description
              }
            </CardDescription>
            <Button 
              className="w-full text-xs md:text-sm py-1 md:py-2"
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
    <div className="mx-4 md:mx-6 lg:mx-8">
      <div
        ref={tagScrollRef}
        className="flex items-center gap-2 mb-4 overflow-x-auto hide-scrollbar px-2 -mx-2 whitespace-nowrap"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {allTagsWithAll.map(tag => (
          <Button
            key={tag}
            variant={activeTag === tag ? 'default' : 'outline'}
            onClick={() => setActiveTag(tag)}
            className="rounded-full px-3 py-1 text-xs md:text-sm mx-1 whitespace-nowrap"
          >
            {tag}
          </Button>
        ))}
      </div>
      {/* Static horizontal scrolling projects container */}
      <div className="relative overflow-x-auto project-card-container" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div
          ref={projectsContainerRef}
          className="flex gap-4 pb-2 cursor-grab select-none"
          style={{ width: 'fit-content' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          {filteredProjects.map((project, index) => (
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
