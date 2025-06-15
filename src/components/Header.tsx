
import React from 'react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto p-4 border-b-2 border-border flex justify-between items-center">
        <h1 className="text-lg font-bold">[YOUR NAME]</h1>
        <nav className="hidden md:flex gap-4 text-sm font-bold">
          <a href="#work" className="hover:text-primary transition-colors">[WORK]</a>
          <a href="#about" className="hover:text-primary transition-colors">[ABOUT]</a>
          <a href="#contact" className="hover:text-primary transition-colors">[CONTACT]</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
