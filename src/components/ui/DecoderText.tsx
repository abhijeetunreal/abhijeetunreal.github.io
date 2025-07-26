import React, { useEffect, useRef, useState } from 'react';

interface DecoderTextProps {
  text: string;
  className?: string;
  animationDelay?: number; // ms per character
}

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:<>,.?/~";

function randomChar() {
  return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
}

export const DecoderText: React.FC<DecoderTextProps> = ({ text, className = '', animationDelay = 10 }) => {
  const [displayed, setDisplayed] = useState<string[]>(() => Array(text.length).fill(''));
  const timeouts = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    setDisplayed(Array(text.length).fill(''));
    text.split('').forEach((finalChar, index) => {
      let frame = 0;
      const maxFrames = 8 + Math.floor(Math.random() * 2);
      const animate = () => {
        if (frame > maxFrames) {
          setDisplayed(prev => {
            const arr = [...prev];
            arr[index] = finalChar;
            return arr;
          });
        } else {
          setDisplayed(prev => {
            const arr = [...prev];
            arr[index] = randomChar();
            return arr;
          });
          frame++;
          timeouts.current[index] = setTimeout(animate, animationDelay + index * 1);
        }
      };
      timeouts.current[index] = setTimeout(animate, index * (animationDelay * 3));
    });
    return () => {
      timeouts.current.forEach(clearTimeout);
    };
  }, [text, animationDelay]);

  // Helper to preserve whitespace and line breaks
  const renderChar = (char: string, i: number) => {
    if (char === ' ') return <span key={i} style={{ whiteSpace: 'pre' }}>&nbsp;</span>;
    if (char === '\n') return <br key={i} />;
    return (
      <span
        key={i}
        className="inline-block opacity-0 animate-char"
        style={{
          animationDelay: `${i * 0.02}s`,
          position: 'relative',
          opacity: displayed[i] === text[i] ? 1 : 0.7,
          color: displayed[i] === text[i] ? undefined : '#888',
          transition: 'color 0.2s',
        }}
      >
        {displayed[i] || '\u00A0'}
      </span>
    );
  };

  return (
    <span className={className} style={{ minHeight: '1em' }}>
      {displayed.map((char, i) => renderChar(char === '\n' ? '\n' : char, i))}
      <style>{`
        @keyframes decode {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.8) rotateX(90deg);
          }
          60% {
            opacity: 0.25;
            transform: translateY(-4px) scale(1.1) rotateX(10deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1) rotateX(0deg);
          }
        }
        .animate-char {
          animation: decode 0.2s cubic-bezier(.215,0.61,0.355,1) forwards;
        }
      `}</style>
    </span>
  );
};

export default DecoderText; 