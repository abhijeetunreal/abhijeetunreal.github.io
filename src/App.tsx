import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import ProjectDetail from "./pages/ProjectDetail";
import SplashPage from "./components/SplashPage";
import StickyChat from "./components/StickyChat";
import content from '@/data/content.json';
import { slugify } from '@/lib/utils';
import { Project } from "./types/content";

const queryClient = new QueryClient();

const App = () => {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  const handleSelectProject = (slug: string) => {
    setSelectedSlug(slug);
    window.scrollTo(0, 0);
  };

  const handleGoHome = () => {
    setSelectedSlug(null);
    window.scrollTo(0, 0);
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Get current project and its index
  const project = selectedSlug
    ? content.projects.find((p) => slugify(p.title) === selectedSlug) as Project | undefined
    : null;
  
  const currentProjectIndex = project 
    ? content.projects.findIndex((p) => slugify(p.title) === selectedSlug)
    : -1;

  // Determine next and previous projects
  const nextProject = currentProjectIndex >= 0 && currentProjectIndex < content.projects.length - 1
    ? content.projects[currentProjectIndex + 1] as Project
    : null;
  
  const previousProject = currentProjectIndex > 0
    ? content.projects[currentProjectIndex - 1] as Project
    : null;

  const handleNextProject = () => {
    if (nextProject) {
      setSelectedSlug(slugify(nextProject.title));
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousProject = () => {
    if (previousProject) {
      setSelectedSlug(slugify(previousProject.title));
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    // When a project is selected, push a new state to the history stack
    if (selectedSlug) {
      window.history.pushState({ project: selectedSlug }, "", `#project/${selectedSlug}`);
    }
  }, [selectedSlug]);

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      // If we are in ProjectDetail, go back to home when popstate occurs
      if (selectedSlug) {
        setSelectedSlug(null);
        window.scrollTo(0, 0);
      }
    };
    if (selectedSlug) {
      window.addEventListener("popstate", onPopState);
      return () => {
        window.removeEventListener("popstate", onPopState);
      };
    }
  }, [selectedSlug]);

  // The theme is now handled by ThemeToggle.tsx
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div data-splash={showSplash.toString()}>
          {showSplash ? (
            <SplashPage onComplete={handleSplashComplete} />
          ) : (
            <>
              {project ? (
                <ProjectDetail 
                  project={project} 
                  onBack={handleGoHome}
                  onNextProject={handleNextProject}
                  onPreviousProject={handlePreviousProject}
                  hasNextProject={!!nextProject}
                  hasPreviousProject={!!previousProject}
                />
              ) : (
                <Index onSelectProject={handleSelectProject} onGoHome={handleGoHome} />
              )}
              <StickyChat projects={content.projects as Project[]} />
            </>
          )}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
