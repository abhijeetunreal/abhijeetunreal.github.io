import React, { useEffect, useRef, useState } from 'react';

interface DecoderTextProps {
  text: string;
  className?: string;
  animationDelay?: number; // ms per character
  onAnimationProgress?: (progress: number) => void;
}

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:<>,.?/~";

function randomChar() {
  return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
}

export const DecoderText: React.FC<DecoderTextProps> = ({ text, className = '', animationDelay = 10, onAnimationProgress }) => {
  const [displayed, setDisplayed] = useState<string[]>(() => Array(text.length).fill(''));
  const timeouts = useRef<NodeJS.Timeout[]>([]);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    setDisplayed(Array(text.length).fill(''));
    setAnimationProgress(0);
    
    text.split('').forEach((finalChar, index) => {
      let frame = 0;
      const maxFrames = 1 + Math.floor(Math.random() * 0.5);
      const animate = () => {
        if (frame > maxFrames) {
          setDisplayed(prev => {
            const arr = [...prev];
            arr[index] = finalChar;
            return arr;
          });
          const newProgress = (index + 1) / text.length;
          setAnimationProgress(prev => Math.max(prev, newProgress));
          onAnimationProgress?.(newProgress);
        } else {
          setDisplayed(prev => {
            const arr = [...prev];
            arr[index] = randomChar();
            return arr;
          });
          frame++;
          timeouts.current[index] = setTimeout(animate, animationDelay + index * 2);
        }
      };
      timeouts.current[index] = setTimeout(animate, index * (animationDelay * 2));
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
          animationDelay: `${i * 0.0}s`,
          position: 'relative',
          opacity: displayed[i] === text[i] ? 1 : 0.1,
          color: displayed[i] === text[i] ? undefined : '#888',
          transition: 'color 0.2s',
        }}
      >
        {displayed[i] || '\u00A0'}
      </span>
    );
  };

  // Process text for markdown-like formatting
  const processText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-muted/50 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
      .replace(/^- (.*)/gm, '<div class="flex items-start gap-2 mb-1"><span class="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>$1</span></div>')
      .replace(/\n/g, '<br/>');
  };

  // Simple fallback rendering if HTML processing fails
  const renderText = () => {
    try {
      const processedText = processText(displayed.join(''));
      return (
        <div 
          className={className} 
          style={{ minHeight: '1em' }}
          dangerouslySetInnerHTML={{ 
            __html: processedText
          }}
        />
      );
    } catch (error) {
      // Fallback to simple text rendering
      return (
        <div className={className} style={{ minHeight: '1em' }}>
          {displayed.join('')}
        </div>
      );
    }
  };

  return (
    <>
      {renderText()}
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
          animation: decode 0.5s cubic-bezier(.215,0.61,0.355,1) forwards;
        }
      `}</style>
    </>
  );
};

export default DecoderText; 