
import React, { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import content from '@/data/content.json';
import { DecoderText } from './ui/DecoderText';

const Header = ({ onGoHome }: { onGoHome: () => void }) => {
  const [navStep, setNavStep] = useState(0);
  const navLinks = content.navLinks;
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-lg">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <button onClick={onGoHome} className="text-lg font-bold hover:no-underline bg-transparent border-none p-0 cursor-pointer">
          <DecoderText text={content.name} animationDelay={18} onAnimationProgress={progress => {
            if (progress === 1 && navStep === 0) setNavStep(1);
          }} />
        </button>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-4 text-sm font-bold">
            {navLinks.map((link, i) =>
              navStep > i ? (
                <a href={link.href} key={link.label} className="hover:text-primary transition-colors">
                  <DecoderText text={link.label} animationDelay={14} onAnimationProgress={progress => {
                    if (progress === 1 && navStep === i + 1) setNavStep(i + 2);
                  }} />
                </a>
              ) : null
            )}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
