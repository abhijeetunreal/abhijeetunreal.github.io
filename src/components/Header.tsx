
import React, { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import content from '@/data/content.json';
import { DecoderText } from './ui/DecoderText';

const Header = ({ onGoHome }: { onGoHome: () => void }) => {
  const [navStep, setNavStep] = useState(0);
  const navLinks = content.navLinks;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-lg">
      <div className="w-full p-6 sm:p-8">
        <nav className="flex justify-center sm:justify-end">
          <ul className="flex items-center space-x-6 md:space-x-8 text-sm font-bold tracking-wider">
            <li>
              <button 
                onClick={onGoHome} 
                className="hover:text-gray-400 transition-colors duration-300 bg-transparent border-none p-0 cursor-pointer"
              >
                <DecoderText 
                  text={content.name} 
                  animationDelay={18} 
                  onAnimationProgress={progress => {
                    if (progress === 1 && navStep === 0) setNavStep(1);
                  }} 
                />
              </button>
            </li>
            {navLinks.map((link, i) =>
              navStep > i ? (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-gray-400 transition-colors duration-300">
                    <DecoderText 
                      text={link.label} 
                      animationDelay={14} 
                      onAnimationProgress={progress => {
                        if (progress === 1 && navStep === i + 1) setNavStep(i + 2);
                      }} 
                    />
                  </a>
                </li>
              ) : null
            )}
            <li><ThemeToggle /></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
