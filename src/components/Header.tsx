
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [underlineStyle, setUnderlineStyle] = useState<{ left: number; width: number }>({ left: -100, width: 0 });
  const rafIdRef = useRef<number | null>(null);

  const updateUnderline = () => {
    const idx = navLinks.findIndex(link => link.label.replace(/\[|\]/g, '').toUpperCase() === currentSection.toUpperCase());
    const ref = navRefs[idx]?.current;
    const container = containerRef.current;
    if (ref && container) {
      // Find the actual text element inside (DecoderText renders a div)
      const textElement = ref.querySelector('div') || ref;
      const rect = textElement.getBoundingClientRect();
      const parentRect = container.getBoundingClientRect();
      if (parentRect) {
        setUnderlineStyle({ left: rect.left - parentRect.left, width: rect.width });
      }
    } else {
      // If no match found, don't show underline
      setUnderlineStyle({ left: 0, width: 0 });
    }
  };

  useEffect(() => {
    // Update multiple times to catch animation completion
    updateUnderline();
    const timer1 = setTimeout(updateUnderline, 50);
    const timer2 = setTimeout(updateUnderline, 150);
    const timer3 = setTimeout(updateUnderline, 300);
    const timer4 = setTimeout(updateUnderline, 500);
    
    // Use requestAnimationFrame to continuously check until stable
    let lastWidth = 0;
    let stableCount = 0;
    const checkStable = () => {
      const idx = navLinks.findIndex(link => link.label.replace(/\[|\]/g, '').toUpperCase() === currentSection.toUpperCase());
      const ref = navRefs[idx]?.current;
      const container = containerRef.current;
      if (ref && container) {
        const textElement = ref.querySelector('div') || ref;
        const rect = textElement.getBoundingClientRect();
        if (Math.abs(rect.width - lastWidth) < 0.1) {
          stableCount++;
          if (stableCount >= 3) {
            updateUnderline();
            return;
          }
        } else {
          stableCount = 0;
        }
        lastWidth = rect.width;
        updateUnderline();
        rafIdRef.current = requestAnimationFrame(checkStable);
      }
    };
    rafIdRef.current = requestAnimationFrame(checkStable);
    
    // Update on window resize
    window.addEventListener('resize', updateUnderline);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      window.removeEventListener('resize', updateUnderline);
    };
  }, [currentSection, navLinks]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-lg">
      <div className="w-full px-4 sm:px-6 py-3 sm:py-4">
        <nav className="flex justify-between items-center">
          {/* Back Button */}
          {showBackButton && (
            <button
              onClick={onGoHome}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-background/20 transition-colors duration-200 group"
              title="Go back"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform duration-200" />
              <span className="hidden md:inline font-medium">back</span>
            </button>
          )}
          
          <div ref={containerRef} className={`relative ${showBackButton ? 'ml-auto' : 'mx-auto'}`}>
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
                      // Update underline after click with delays to catch animation
                      setTimeout(updateUnderline, 100);
                      setTimeout(updateUnderline, 300);
                      setTimeout(updateUnderline, 500);
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
