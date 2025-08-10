import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import ExperimentalProjects from "./pages/ExperimentalProjects";
import ExperimentalProjectDetail from "./pages/ExperimentalProjectDetail";
import Blog from "./pages/Blog";
import BlogPostDetail from "./pages/BlogPostDetail";
import SplashPage from "./components/SplashPage";
import StickyChat from "./components/StickyChat";
import content from '@/data/content.json';
import { slugify } from '@/lib/utils';
import { Project } from "./types/content";

const queryClient = new QueryClient();

const App = () => {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [selectedExperimentalSlug, setSelectedExperimentalSlug] = useState<string | null>(null);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [showSplash, setShowSplash] = useState(true);

  const handleSelectProject = (slug: string) => {
    setSelectedSlug(slug);
    setSelectedExperimentalSlug(null);
    window.scrollTo(0, 0);
  };

  const handleSelectExperimentalProject = (slug: string) => {
    setSelectedExperimentalSlug(slug);
    setSelectedSlug(null);
    setSelectedBlogSlug(null);
    window.scrollTo(0, 0);
  };

  const handleSelectBlogPost = (slug: string) => {
    setSelectedBlogSlug(slug);
    setSelectedSlug(null);
    setSelectedExperimentalSlug(null);
    setCurrentPage("blog"); // Keep current page as blog when viewing a post
    window.scrollTo(0, 0);
  };

  const handleGoHome = () => {
    setSelectedSlug(null);
    setCurrentPage("home");
    window.scrollTo(0, 0);
  };

  const handleGoToAbout = () => {
    setSelectedSlug(null);
    setCurrentPage("about");
    window.scrollTo(0, 0);
  };

  const handleGoToExperimental = () => {
    setSelectedSlug(null);
    setSelectedExperimentalSlug(null);
    setSelectedBlogSlug(null);
    setCurrentPage("experimental");
    window.scrollTo(0, 0);
  };

  const handleGoToBlog = () => {
    setSelectedSlug(null);
    setSelectedExperimentalSlug(null);
    setSelectedBlogSlug(null);
    setCurrentPage("blog");
    window.scrollTo(0, 0);
  };

  const handleBackFromBlogPost = () => {
    // Ensure we properly navigate back from blog post detail
    setSelectedBlogSlug(null);
    setCurrentPage("blog");
    window.scrollTo(0, 0);
    
    // Update browser history to reflect the blog list page
    window.history.pushState({ page: "blog" }, "", `#blog`);
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

  // Get current experimental project and its index
  const experimentalProject = selectedExperimentalSlug
    ? content.experimentalProjects.find((p) => slugify(p.title) === selectedExperimentalSlug) as Project | undefined
    : null;
  
  const currentExperimentalProjectIndex = experimentalProject 
    ? content.experimentalProjects.findIndex((p) => slugify(p.title) === selectedExperimentalSlug)
    : -1;

  // Determine next and previous experimental projects
  const nextExperimentalProject = currentExperimentalProjectIndex >= 0 && currentExperimentalProjectIndex < content.experimentalProjects.length - 1
    ? content.experimentalProjects[currentExperimentalProjectIndex + 1] as Project
    : null;
  
  const previousExperimentalProject = currentExperimentalProjectIndex > 0
    ? content.experimentalProjects[currentExperimentalProjectIndex - 1] as Project
    : null;

  // Get current blog post and its index
  const blogPost = selectedBlogSlug
    ? content.blogPosts.find((p) => slugify(p.title) === selectedBlogSlug) as Project | undefined
    : null;
  
  const currentBlogPostIndex = blogPost 
    ? content.blogPosts.findIndex((p) => slugify(p.title) === selectedBlogSlug)
    : -1;

  // Determine next and previous blog posts
  const nextBlogPost = currentBlogPostIndex >= 0 && currentBlogPostIndex < content.blogPosts.length - 1
    ? content.blogPosts[currentBlogPostIndex + 1] as Project
    : null;
  
  const previousBlogPost = currentBlogPostIndex > 0
    ? content.blogPosts[currentBlogPostIndex - 1] as Project
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

  const handleNextExperimentalProject = () => {
    if (nextExperimentalProject) {
      setSelectedExperimentalSlug(slugify(nextExperimentalProject.title));
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousExperimentalProject = () => {
    if (previousExperimentalProject) {
      setSelectedExperimentalSlug(slugify(previousExperimentalProject.title));
      window.scrollTo(0, 0);
    }
  };

  const handleNextBlogPost = () => {
    if (nextBlogPost) {
      setSelectedBlogSlug(slugify(nextBlogPost.title));
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousBlogPost = () => {
    if (previousBlogPost) {
      setSelectedBlogSlug(slugify(previousBlogPost.title));
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    // When a project is selected, push a new state to the history stack
    if (selectedSlug) {
      window.history.pushState({ project: selectedSlug }, "", `#project/${selectedSlug}`);
    } else if (selectedExperimentalSlug) {
      window.history.pushState({ experimentalProject: selectedExperimentalSlug }, "", `#experimental-project/${selectedExperimentalSlug}`);
    } else if (selectedBlogSlug) {
      window.history.pushState({ blogPost: selectedBlogSlug }, "", `#blog-post/${selectedBlogSlug}`);
    } else if (currentPage === "about") {
      window.history.pushState({ page: "about" }, "", `#about`);
    } else if (currentPage === "experimental") {
      window.history.pushState({ page: "experimental" }, "", `#experimental`);
    } else if (currentPage === "blog") {
      window.history.pushState({ page: "blog" }, "", `#blog`);
    } else {
      window.history.pushState({ page: "home" }, "", `#`);
    }
  }, [selectedSlug, selectedExperimentalSlug, selectedBlogSlug, currentPage]);

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      // Handle navigation back
      if (selectedSlug) {
        setSelectedSlug(null);
        setCurrentPage("home");
        window.scrollTo(0, 0);
      } else if (selectedExperimentalSlug) {
        setSelectedExperimentalSlug(null);
        setCurrentPage("experimental");
        window.scrollTo(0, 0);
      } else if (selectedBlogSlug) {
        setSelectedBlogSlug(null);
        setCurrentPage("blog");
        window.scrollTo(0, 0);
      } else if (currentPage === "about") {
        setCurrentPage("home");
        window.scrollTo(0, 0);
      } else if (currentPage === "experimental") {
        setCurrentPage("home");
        window.scrollTo(0, 0);
      } else if (currentPage === "blog") {
        setCurrentPage("home");
        window.scrollTo(0, 0);
      }
    };

    // Add event listener for browser back/forward buttons
    window.addEventListener("popstate", onPopState);
    
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [selectedSlug, selectedExperimentalSlug, selectedBlogSlug, currentPage]);

  // Initialize browser history on component mount
  useEffect(() => {
    // Set initial history state
    if (!selectedSlug && !selectedExperimentalSlug && !selectedBlogSlug && currentPage === "home") {
      window.history.replaceState({ page: "home" }, "", `#`);
    }
  }, []);

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
                  onNavigateToExperimental={handleGoToExperimental}
                  onGoToAbout={handleGoToAbout}
                />
              ) : experimentalProject ? (
                <ExperimentalProjectDetail 
                  project={experimentalProject} 
                  onBack={handleGoToExperimental}
                  onNextProject={handleNextExperimentalProject}
                  onPreviousProject={handlePreviousExperimentalProject}
                  hasNextProject={!!nextExperimentalProject}
                  hasPreviousProject={!!previousExperimentalProject}
                  onNavigateToAbout={handleGoToAbout}
                  onNavigateToExperimental={handleGoToExperimental}
                  onNavigateToBlog={handleGoToBlog}
                />
              ) : blogPost ? (
                <BlogPostDetail 
                  post={blogPost} 
                  onBack={handleBackFromBlogPost}
                  onNextPost={handleNextBlogPost}
                  onPreviousPost={handlePreviousBlogPost}
                  hasNextPost={!!nextBlogPost}
                  hasPreviousPost={!!previousBlogPost}
                  onNavigateToAbout={handleGoToAbout}
                  onNavigateToExperimental={handleGoToExperimental}
                  onNavigateToBlog={handleGoToBlog}
                />
              ) : currentPage === "about" ? (
                <About onGoHome={handleGoHome} onGoToAbout={handleGoToAbout} onNavigateToExperimental={handleGoToExperimental} onNavigateToBlog={handleGoToBlog} />
              ) : currentPage === "experimental" ? (
                <ExperimentalProjects onGoHome={handleGoHome} onGoToAbout={handleGoToAbout} onSelectExperimentalProject={handleSelectExperimentalProject} onNavigateToExperimental={handleGoToExperimental} onNavigateToBlog={handleGoToBlog} />
              ) : currentPage === "blog" ? (
                <Blog onGoHome={handleGoHome} onGoToAbout={handleGoToAbout} onSelectBlogPost={handleSelectBlogPost} onNavigateToExperimental={handleGoToExperimental} onNavigateToBlog={handleGoToBlog} />
              ) : (
                                <Index 
                  onSelectProject={handleSelectProject} 
                  onGoHome={handleGoHome} 
                  onGoToAbout={handleGoToAbout} 
                  onNavigateToExperimental={handleGoToExperimental} 
                  onNavigateToBlog={handleGoToBlog}
                />
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
