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

const PROJECTS_TO_SHOW_INITIALLY = 6;

const ProjectShowcase = ({ projects, tags, onSelectProject }: ProjectShowcaseProps) => {
  const [activeTag, setActiveTag] = useState<string>('All');
  const [isExpanded, setIsExpanded] = useState(false);
  const tagScrollRef = useRef<HTMLDivElement>(null);

  const filteredProjects = useMemo(() => {
    if (activeTag === 'All') {
      return projects;
    }
    return projects.filter(p => p.tags.includes(activeTag));
  }, [activeTag, projects]);

  const projectsToShow = useMemo(() => {
    if (isExpanded) {
      return filteredProjects;
    }
    return filteredProjects.slice(0, PROJECTS_TO_SHOW_INITIALLY);
  }, [isExpanded, filteredProjects]);

  const allTagsWithAll = useMemo(() => ['All', ...tags], [tags]);

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
      <Card className="h-full flex flex-col animate-fade-in border-accent group-hover:border-primary transition-colors overflow-hidden" style={{ animationDelay: `${index * 100}ms` }}>
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projectsToShow.map((project, index) => (
          <ProjectCard project={project} onSelectProject={onSelectProject} index={index} key={project.title} />
        ))}
      </div>
      {filteredProjects.length > PROJECTS_TO_SHOW_INITIALLY && (
        <div className="mt-12 text-center">
          <Button variant="outline" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Show Less' : 'View More'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectShowcase;
