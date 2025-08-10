import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import content from '@/data/content.json';
import { slugify } from '@/lib/utils';

interface ExperimentalProjectsProps {
  onGoHome: () => void;
  onGoToAbout: () => void;
}

const ExperimentalProjects: React.FC<ExperimentalProjectsProps> = ({ onGoHome }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onGoHome}
              className="flex items-center gap-2 hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-bold">EXPERIMENTAL PROJECTS</h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Page Description */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Experimental & Conceptual Work
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A collection of experimental projects, conceptual designs, and innovative explorations 
            that push the boundaries of what's possible in design and technology.
          </p>
        </div>

        {/* Projects Grid - Image-only cards with title above */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4 md:gap-6 mb-16">
          {content.experimentalProjects.map((project, index) => (
            <div
              key={index}
              className="group cursor-pointer project-card"
            >
              {/* Title above the card */}
              <h3 className="text-xs md:text-sm font-test mb-0 text-left">
                {project.title}
              </h3>
              
              {/* Card with full image */}
              <Card className="animate-fade-in border-accent group-hover:border-primary transition-colors overflow-hidden aspect-[3/4] rounded-sm" style={{ animationDelay: `${index * 50}ms` }}>
                {project.cardImage && (
                  <div
                    className="w-full h-full bg-cover bg-center relative project-card-image"
                    style={{ backgroundImage: `url(${project.cardImage})` }}
                    data-src={project.cardImage}
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-6">
            Interested in collaborating on experimental projects?
          </p>
          <Button size="lg" className="px-8 py-3">
            Let's Connect
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ExperimentalProjects;
