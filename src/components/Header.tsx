
import React, { useRef, useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import content from '@/data/content.json';
import { DecoderText } from './ui/DecoderText';

interface HeaderProps {
  onGoHome: () => void;
  currentSection: 'HOME' | 'ABOUT' | 'CONTACT';
}

const navLinks = [
  { label: 'HOME', href: '#' },
  { label: 'ABOUT', href: '#about' },
  { label: 'CONTACT', href: '#contact' },
];

const Header = ({ onGoHome, currentSection }: HeaderProps) => {
  const navRefs = [useRef<HTMLButtonElement | null>(null), useRef<HTMLAnchorElement | null>(null), useRef<HTMLAnchorElement | null>(null)];
  const underlineRef = useRef<HTMLDivElement | null>(null);
  const [underlineStyle, setUnderlineStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  useEffect(() => {
    const idx = navLinks.findIndex(link => link.label === currentSection);
    const ref = navRefs[idx].current;
    if (ref) {
      const rect = ref.getBoundingClientRect();
      const parentRect = ref.parentElement?.parentElement?.getBoundingClientRect();
      if (parentRect) {
        setUnderlineStyle({ left: rect.left - parentRect.left, width: rect.width });
      }
    }
  }, [currentSection]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-lg">
      <div className="w-full p-6 sm:p-8">
        <nav className="flex justify-center sm:justify-end">
          <div className="relative">
            <ul className="flex items-center space-x-6 md:space-x-8 text-sm font-bold tracking-wider relative">
              <li>
                <button
                  ref={navRefs[0] as React.RefObject<HTMLButtonElement>}
                  onClick={onGoHome}
                  className={`hover:text-gray-400 transition-colors duration-300 bg-transparent border-none p-0 cursor-pointer ${currentSection === 'HOME' ? 'font-bold' : ''}`}
                >
                  <DecoderText text={content.name} animationDelay={18} />
                </button>
              </li>
              <li>
                <a
                  ref={navRefs[1] as React.RefObject<HTMLAnchorElement>}
                  href="#about"
                  className={`hover:text-gray-400 transition-colors duration-300 ${currentSection === 'ABOUT' ? 'font-bold' : ''}`}
                >
                  ABOUT
                </a>
              </li>
              <li>
                <a
                  ref={navRefs[2] as React.RefObject<HTMLAnchorElement>}
                  href="#contact"
                  className={`hover:text-gray-400 transition-colors duration-300 ${currentSection === 'CONTACT' ? 'font-bold' : ''}`}
                >
                  CONTACT
                </a>
              </li>
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
