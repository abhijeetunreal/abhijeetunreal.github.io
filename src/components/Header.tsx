
import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Link } from 'react-router-dom';
import content from '@/data/content.json';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-background/70 backdrop-blur-lg">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-lg font-bold hover:no-underline">{content.name}</Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-4 text-sm font-bold">
            {content.navLinks.map(link => (
              <a href={link.href} key={link.label} className="hover:text-primary transition-colors">{link.label}</a>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
