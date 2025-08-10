import React from 'react';
import Header from '@/components/Header';
import content from '@/data/content.json';
import AIPhilosophyGrid from '@/components/AIPhilosophyGrid';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/Footer';

interface AboutProps {
  onGoHome: () => void;
  onGoToAbout: () => void;
  onNavigateToExperimental: () => void;
  onNavigateToBlog: () => void;
}

const About: React.FC<AboutProps> = ({ onGoHome, onGoToAbout, onNavigateToExperimental, onNavigateToBlog }) => {
  const { aboutPage } = content;

  return (
    <div className="text-foreground min-h-screen font-mono relative z-[60]">
      <Header onGoHome={onGoHome} onGoToAbout={onGoToAbout} currentSection="ABOUT" />
      
      <main className="container mx-auto px-4 pt-24 md:pt-32 pb-16">
        {/* Hero Section */}
        <section className="mb-24 md:mb-32">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{aboutPage.title}</h1>
            <p className="text-xl md:text-2xl text-muted-foreground">{aboutPage.subtitle}</p>
          </div>
          
          {/* Bio Section */}
          <div className="space-y-6 text-lg leading-relaxed max-w-4xl mx-auto">
            <p>{aboutPage.bio.intro}</p>
            <p>{aboutPage.bio.mission}</p>
            <p>{aboutPage.bio.approach}</p>
          </div>
        </section>

        <Separator className="my-16" />

        {/* Education Section */}
        <section className="mb-24 md:mb-32">
          <h2 className="text-3xl font-bold mb-8 text-center">Education</h2>
          <div className="space-y-8 max-w-4xl mx-auto">
            {aboutPage.education.map((edu, index) => (
              <div key={index} className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-semibold mb-2">{edu.degree}</h3>
                <p className="text-lg text-primary mb-1">{edu.institution}</p>
                <p className="text-sm text-muted-foreground mb-3">{edu.year}</p>
                <p className="text-base leading-relaxed">{edu.description}</p>
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        {/* Experience Section */}
        <section className="mb-24 md:mb-32">
          <h2 className="text-3xl font-bold mb-8 text-center">Experience</h2>
          <div className="space-y-8 max-w-4xl mx-auto">
            {aboutPage.experience.map((exp, index) => (
              <div key={index} className="border-l-4 border-primary pl-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{exp.role}</h3>
                    <p className="text-lg text-primary">{exp.company}</p>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {exp.duration}
                  </Badge>
                </div>
                <p className="text-base leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        {/* Skills Section */}
        <section className="mb-24 md:mb-32">
          <h2 className="text-3xl font-bold mb-8 text-center">Skills</h2>
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Design Skills */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">Design</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {aboutPage.skills.design.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-sm px-4 py-2">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Technology Skills */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">Technology</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {aboutPage.skills.technology.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-sm px-4 py-2">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">Tools</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {aboutPage.skills.tools.map((tool, index) => (
                  <Badge key={index} variant="outline" className="text-sm px-4 py-2">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-16" />

        {/* Interests Section */}
        <section className="mb-24 md:mb-32">
          <h2 className="text-3xl font-bold mb-8 text-center">Interests</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {aboutPage.interests.map((interest, index) => (
              <Badge key={index} variant="secondary" className="text-sm px-4 py-2">
                {interest}
              </Badge>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        {/* Awards Section */}
        <section className="mb-24 md:mb-32">
          <h2 className="text-3xl font-bold mb-8 text-center">Awards & Recognition</h2>
          <div className="space-y-8 max-w-4xl mx-auto">
            {aboutPage.awards.map((award, index) => (
              <div key={index} className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-semibold mb-2">{award.title}</h3>
                <p className="text-lg text-primary mb-3">{award.organization}</p>
                <p className="text-base leading-relaxed">{award.description}</p>
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        {/* AI Philosophy Grid */}
        <section className="mb-24 md:mb-32">
          <h2 className="text-3xl font-bold mb-8 text-center">Design Philosophy</h2>
          <p className="text-center text-muted-foreground mb-8 text-lg">
            Click on a cell in the grid to generate a unique design philosophy statement, powered by AI trained on my work and ethos.
          </p>
          <AIPhilosophyGrid />
        </section>
      </main>
      <Footer onNavigateToExperimental={onNavigateToExperimental} onNavigateToBlog={onNavigateToBlog} />
    </div>
  );
};

export default About; 