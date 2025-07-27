import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Logo from "./components/Logo";
import ProjectDetail from "./pages/ProjectDetail";
import SplashPage from "./components/SplashPage";
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

  const project = selectedSlug
    ? content.projects.find((p) => slugify(p.title) === selectedSlug)
    : null;
  
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
              <Logo customEnvLink={content.environment?.customEnvLink} />
              {project ? (
                <ProjectDetail project={project} onBack={handleGoHome} />
              ) : (
                <Index onSelectProject={handleSelectProject} onGoHome={handleGoHome} />
              )}
            </>
          )}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
