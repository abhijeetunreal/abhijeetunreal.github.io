import React from 'react';
import Header from '@/components/Header';
import content from '@/data/content.json';
import AIPhilosophyGrid from '@/components/AIPhilosophyGrid';
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
                     <div className="flex items-center gap-3 mb-2">
                                                                       <div className="h-8 w-auto min-w-24 flex items-center justify-start">
                          {exp.companyLogo ? (
                            <>
                              <img 
                                src={exp.companyLogo} 
                                alt={exp.company}
                                className="h-6 w-auto max-w-full object-contain dark:hidden"
                                onError={(e) => {
                                  // Fallback to text if image fails to load
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const fallback = target.nextElementSibling as HTMLElement;
                                  if (fallback) {
                                    fallback.style.display = 'block';
                                  }
                                }}
                              />
                              {exp.companyDarkLogo && (
                                <img 
                                  src={exp.companyDarkLogo} 
                                  alt={exp.company}
                                  className="h-6 w-auto max-w-full object-contain hidden dark:block"
                                  onError={(e) => {
                                    // Fallback to text if image fails to load
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const fallback = target.nextElementSibling as HTMLElement;
                                    if (fallback) {
                                      fallback.style.display = 'block';
                                    }
                                  }}
                                />
                              )}
                            </>
                                                     ) : (
                             <p className="text-lg text-primary font-medium">{exp.company}</p>
                           )}
                        </div>
                     </div>
                     <h3 className="text-xl font-semibold">{exp.role}</h3>
                   </div>
                  <span className="text-sm text-muted-foreground font-medium">
                    {exp.duration}
                  </span>
                </div>
                <p className="text-base leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        {/* Skills & Interests Quadrant Section */}
        <section className="mb-24 md:mb-32">
          <h2 className="text-3xl font-bold mb-8 text-center">Skills & Interests</h2>
          <div className="max-w-6xl mx-auto">
            {/* Quadrant Container */}
            <div className="relative aspect-square max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto">
              {/* Central Axis Lines */}
              <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-foreground/20 to-transparent transform -translate-x-1/2"></div>
              <div className="absolute left-0 top-1/2 w-full h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent transform -translate-y-1/2"></div>
              
              {/* Technology Quadrant (Top Right: x, y) */}
              <div className="absolute top-0 right-0 w-1/2 h-1/2 p-2 sm:p-3 md:p-4">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 text-center text-foreground">Technology</h3>
                <div className="h-[calc(100%-theme(spacing.8))] sm:h-[calc(100%-theme(spacing.12))] md:h-[calc(100%-theme(spacing.16))] overflow-y-auto space-y-1 pr-1 sm:pr-2">
                  {aboutPage.skills.technology.map((skill, index) => (
                    <div key={index} className="text-foreground/80 hover:text-foreground transition-colors cursor-default text-xs sm:text-sm">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              {/* Design Quadrant (Top Left: -x, y) */}
              <div className="absolute top-0 left-0 w-1/2 h-1/2 p-2 sm:p-3 md:p-4">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 text-center text-foreground">Design</h3>
                <div className="h-[calc(100%-theme(spacing.8))] sm:h-[calc(100%-theme(spacing.12))] md:h-[calc(100%-theme(spacing.16))] overflow-y-auto space-y-1 pr-1 sm:pr-2">
                  {aboutPage.skills.design.map((skill, index) => (
                    <div key={index} className="text-foreground/80 hover:text-foreground transition-colors cursor-default text-xs sm:text-sm">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools Quadrant (Bottom Left: -x, -y) */}
              <div className="absolute bottom-0 left-0 w-1/2 h-1/2 p-2 sm:p-3 md:p-4">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 text-center text-foreground">Tools</h3>
                <div className="h-[calc(100%-theme(spacing.8))] sm:h-[calc(100%-theme(spacing.12))] md:h-[calc(100%-theme(spacing.16))] overflow-y-auto space-y-1 pr-1 sm:pr-2">
                  {aboutPage.skills.tools.map((tool, index) => (
                    <div key={index} className="text-foreground/80 hover:text-foreground transition-colors cursor-default text-xs sm:text-sm">
                      {tool}
                    </div>
                  ))}
                </div>
              </div>

              {/* Interests Quadrant (Bottom Right: x, -y) */}
              <div className="absolute bottom-0 right-0 w-1/2 h-1/2 p-2 sm:p-3 md:p-4">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 text-center text-foreground">Interests</h3>
                <div className="h-[calc(100%-theme(spacing.8))] sm:h-[calc(100%-theme(spacing.16))] md:h-[calc(100%-theme(spacing.20))] overflow-y-auto space-y-1 pr-1 sm:pr-2">
                  {aboutPage.interests.map((interest, index) => (
                    <div key={index} className="text-foreground/80 hover:text-foreground transition-colors cursor-default text-xs sm:text-sm">
                      {interest}
                    </div>
                  ))}
                </div>
              </div>

              {/* Center Point */}
              <div className="absolute top-1/2 left-1/2 w-2 sm:w-3 h-2 sm:h-3 bg-foreground/40 rounded-full transform -translate-x-1/2 -translate-y-1/2 border border-background sm:border-2"></div>
            </div>

            {/* Legend */}
            <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-muted-foreground">
              <p>Each quadrant represents a different category of expertise and interests</p>
            </div>
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