
import React, { useRef, useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import content from '@/data/content.json';
import { DecoderText } from './ui/DecoderText';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  onGoHome: () => void;
  onGoToAbout?: () => void;
  currentSection: string;
  showBackButton?: boolean;
}

const Header = ({ onGoHome, onGoToAbout, currentSection, showBackButton = false }: HeaderProps) => {
  const navLinks = content.navLinks || [];
  const navRefs = navLinks.map(() => useRef<HTMLAnchorElement | null>(null));
  const underlineRef = useRef<HTMLDivElement | null>(null);
  const [underlineStyle, setUnderlineStyle] = useState<{ left: number; width: number }>({ left: -100, width: 0 });

  useEffect(() => {
    const updateUnderline = () => {
      const idx = navLinks.findIndex(link => link.label.replace(/\[|\]/g, '').toUpperCase() === currentSection.toUpperCase());
      const ref = navRefs[idx]?.current;
      if (ref) {
        const rect = ref.getBoundingClientRect();
        const parentRect = ref.parentElement?.parentElement?.getBoundingClientRect();
        if (parentRect) {
          setUnderlineStyle({ left: rect.left - parentRect.left, width: rect.width });
        }
      } else {
        // If no match found, don't show underline
        setUnderlineStyle({ left: 0, width: 0 });
      }
    };

    // Update immediately
    updateUnderline();
    
    // Also update after a short delay to ensure DOM is ready
    const timer = setTimeout(updateUnderline, 50);
    return () => clearTimeout(timer);
  }, [currentSection, navLinks, navRefs]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-lg">
      <div className="w-full p-6 sm:p-8">
        <nav className="flex justify-between items-center">
          {/* Back Button */}
          {showBackButton && (
            <button
              onClick={onGoHome}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-background/20 transition-colors duration-200 group"
              title="Go back"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform duration-200" />
            </button>
          )}
          
          <div className={`relative ${showBackButton ? 'ml-auto' : 'mx-auto'}`}>
            <ul className="flex items-center space-x-6 md:space-x-8 text-sm font-bold tracking-wider relative">
              {navLinks.map((link, i) => (
                <li key={link.label}>
                  <a
                    ref={navRefs[i] as React.RefObject<HTMLAnchorElement>}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      if (link.href === '#') {
                        onGoHome();
                      } else if (link.href === '/#about' && onGoToAbout) {
                        onGoToAbout();
                      }
                    }}
                    className={`hover:text-gray-400 transition-colors duration-300 ${link.label.replace(/\[|\]/g, '').toUpperCase() === currentSection.toUpperCase() ? 'font-bold' : ''}`}
                  >
                    <DecoderText text={link.label} animationDelay={18} />
                  </a>
                </li>
              ))}
              <li><ThemeToggle /></li>
            </ul>
            {/* Animated underline */}
            <div
              ref={underlineRef}
              className="absolute bottom-0 h-[2.5px] bg-primary transition-all duration-300 rounded"
              style={{
                left: underlineStyle.left,
                width: underlineStyle.width,
                transition: 'left 0.3s cubic-bezier(.4,0,.2,1), width 0.3s cubic-bezier(.4,0,.2,1)',
                zIndex: 1,
              }}
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
