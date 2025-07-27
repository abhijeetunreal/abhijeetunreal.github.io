import React, { useEffect, useState } from 'react';
import { DecoderText } from './ui/DecoderText';

interface SplashPageProps {
  onComplete: () => void;
}

const SplashPage: React.FC<SplashPageProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showText1, setShowText1] = useState(false);
  const [showText2, setShowText2] = useState(false);
  const [showText3, setShowText3] = useState(false);
  const [showText4, setShowText4] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade in with smooth easing
    const fadeInTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    // Start revealing text lines one by one with organic staggered timing
    const textTimer1 = setTimeout(() => {
      setShowText1(true);
    }, 400);
    
    const textTimer2 = setTimeout(() => {
      setShowText2(true);
    }, 900);
    
    const textTimer3 = setTimeout(() => {
      setShowText3(true);
    }, 1400);
    
    const textTimer4 = setTimeout(() => {
      setShowText4(true);
    }, 1900);
    
    // Start fade out before completion for smooth transition
    const fadeOutTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2800);
    
    // Complete after 3 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(textTimer1);
      clearTimeout(textTimer2);
      clearTimeout(textTimer3);
      clearTimeout(textTimer4);
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 bg-white z-50 flex items-center justify-center transition-all ${
        isVisible && !fadeOut ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{
        transitionDuration: '1200ms',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="space-y-3">
          {/* First line - CO-CREATING */}
          <div 
            className={`text-left transition-all duration-700 ${
              showText1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            {showText1 && (
              <DecoderText 
                text="CO-CREATING"
                className="text-lg md:text-xl lg:text-2xl font-bold text-black tracking-wider"
                animationDelay={20}
              />
            )}
          </div>
          
          {/* Second line - MODERN (indented) */}
          <div 
            className={`text-right transition-all duration-700 ${
              showText2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            {showText2 && (
              <DecoderText 
                text="MODERN"
                className="text-lg md:text-xl lg:text-2xl font-bold text-black tracking-wider"
                animationDelay={20}
              />
            )}
          </div>
          
          {/* Third line - HUMAN INTERACTION */}
          <div className="flex justify-between items-center">
            <div 
              className={`text-left transition-all duration-700 ${
                showText3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              {showText3 && (
                <DecoderText 
                  text="HUMAN"
                  className="text-lg md:text-xl lg:text-2xl font-bold text-black tracking-wider"
                  animationDelay={20}
                />
              )}
            </div>
            <div 
              className={`text-right transition-all duration-700 ${
                showText4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              {showText4 && (
                <DecoderText 
                  text=" INTERACTION"
                  className="text-lg md:text-xl lg:text-2xl font-bold text-black tracking-wider"
                  animationDelay={20}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashPage; 