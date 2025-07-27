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
  const containerRef = useRef<HTMLDivElement>(null);

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
    
    // Get text context for markdown formatting
    const fullText = displayed.join('');
    const beforeChar = fullText.substring(0, i);
    const afterChar = fullText.substring(i + 1);
    
    // Check if this is a bullet point line
    if (char === '-' && beforeChar.endsWith('\n') && afterChar.startsWith(' ')) {
      return (
        <span key={i} className="flex items-start gap-2 mb-1">
          <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
          <span>{char}</span>
        </span>
      );
    }
    
    // Handle markdown formatting
    
    // Check if this character is part of a markdown pattern
    const isBold = /^\*\*.*\*\*$/.test(beforeChar + char + afterChar) || 
                   /^\*\*.*$/.test(beforeChar + char) && afterChar.includes('**');
    const isItalic = /^\*.*\*$/.test(beforeChar + char + afterChar) || 
                     /^\*.*$/.test(beforeChar + char) && afterChar.includes('*');
    const isCode = /^`.*`$/.test(beforeChar + char + afterChar) || 
                   /^`.*$/.test(beforeChar + char) && afterChar.includes('`');
    const isBullet = /^- .*$/.test(beforeChar + char + afterChar) || 
                     /^- .*$/.test(beforeChar + char) && afterChar.includes('\n');
    
    // Calculate gradient opacity based on animation progress
    const isDecoded = displayed[i] === text[i];
    
    // Find the last fully decoded character position
    let lastDecodedIndex = -1;
    for (let j = 0; j < displayed.length; j++) {
      if (displayed[j] === text[j] && displayed[j] !== '') {
        lastDecodedIndex = j;
      }
    }
    
    // Calculate gradient opacity
    let gradientOpacity = 0;
    
    // Check for scrambling effect first - these should always be very subtle
    if (displayed[i] !== '' && displayed[i] !== text[i]) {
      gradientOpacity = 0.005; // 0.5% opacity for scrambling effect
    } else if (isDecoded) {
      gradientOpacity = 1; // Fully decoded characters
    } else if (lastDecodedIndex >= 0 && i > lastDecodedIndex) {
      // Characters after the last decoded position get gradient opacity from 10% to 0%
      const distance = i - lastDecodedIndex;
      gradientOpacity = Math.max(0, 0.1 - (distance * 0.02));
    } else if (i <= lastDecodedIndex) {
      // Characters before or at the last decoded position
      gradientOpacity = 0.1; // Base opacity for undecoded characters (10%)
    }
    
    const isScrambling = displayed[i] !== '' && displayed[i] !== text[i];
    
    // Build className with markdown formatting
    let spanClassName = isScrambling ? "inline-block" : "inline-block opacity-0 animate-char";
    if (isBold) spanClassName += " font-semibold";
    if (isItalic) spanClassName += " italic";
    if (isCode) spanClassName += " bg-muted/50 px-1.5 py-0.5 rounded text-xs font-mono";
    
    return (
      <span
        key={i}
        className={spanClassName}
        style={{
          animationDelay: isScrambling ? undefined : `${i * 0.0}s`,
          position: 'relative',
          opacity: isScrambling ? 1 : gradientOpacity,
          color: isDecoded ? undefined : (isScrambling ? '#f5f5f5' : '#888'),
          filter: isScrambling ? 'blur(0.5px)' : 'none',
          transition: 'opacity 0.2s ease-out, color 0.2s',
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

  // Render text using individual character spans for proper opacity control
  const renderText = () => {
    return (
      <div 
        ref={containerRef}
        className={className} 
        style={{ 
          minHeight: '1em',
          height: 'auto',
          overflow: 'visible',
          wordWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          display: 'inline-block',
          maxWidth: '100%'
        }}
      >
        {displayed.map((char, i) => {
          // Only render characters that have been processed or are currently being processed
          if (char !== '' || i <= animationProgress * text.length) {
            return renderChar(char, i);
          }
          return null;
        })}
      </div>
    );
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