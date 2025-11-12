import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import content from '@/data/content.json';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import React, { useEffect, useState } from 'react';

interface IndexProps {
  onSelectProject: (slug: string) => void;
  onGoHome: () => void;
  onGoToAbout: () => void;
  onNavigateToExperimental: () => void;
  onNavigateToBlog: () => void;
}

const homeLabel = (content.navLinks && content.navLinks[0]?.label) || 'HOME';

const Index = ({ onSelectProject, onGoHome, onGoToAbout, onNavigateToExperimental, onNavigateToBlog }: IndexProps) => {
  const { hero, workedWith, projects, contactLinks } = content;
  const [currentSection, setCurrentSection] = useState<string>(homeLabel);

  useEffect(() => {
    function onScroll() {
      const contact = document.getElementById('contact');
      const windowHeight = window.innerHeight;
      let found = false;
      if (contact) {
        const rect = contact.getBoundingClientRect();
        if (rect.top < windowHeight * 0.8 && rect.bottom > windowHeight * 0.2) {
          setCurrentSection('CONTACT');
          found = true;
        }
      }
      if (!found) {
        setCurrentSection(homeLabel);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial sync
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="text-foreground min-h-screen font-mono relative z-[60]">
      <Header onGoHome={onGoHome} onGoToAbout={onGoToAbout} currentSection={currentSection} />
      <Hero onGoHome={onGoHome} onSelectProject={onSelectProject} />
      <main className="container mx-auto px-4 pt-20 md:pt-24 pb-16">
        <section id="worked-with" className="mb-24 md:mb-32">
          <h3 className="text-2xl font-bold text-center mb-8">{workedWith.title}</h3>
          <Marquee items={workedWith.companies} />
        </section>
      </main>
      <Footer onNavigateToExperimental={onNavigateToExperimental} onNavigateToBlog={onNavigateToBlog} />
    </div>
  );
};

export default Index;
