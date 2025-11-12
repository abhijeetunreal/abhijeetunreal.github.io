import React, { useEffect, useRef } from 'react';

interface MorphingTextProps {
  texts: string[];
  className?: string;
}

class MorphingTextClass {
  private texts: string[];
  private text1: HTMLSpanElement;
  private text2: HTMLSpanElement;
  private textIndex: number = 0;
  private morph: number = 0;
  private cooldown: number = 0;
  private time: Date = new Date();
  private morphTime: number = 1.5;
  private cooldownTime: number = 1.0;
  private animationFrameId: number | null = null;

  constructor(texts: string[], el1: HTMLSpanElement, el2: HTMLSpanElement) {
    this.texts = texts;
    this.text1 = el1;
    this.text2 = el2;
    this.init();
  }

  init() {
    this.text1.textContent = this.texts[this.textIndex % this.texts.length];
    this.text2.textContent = this.texts[(this.textIndex + 1) % this.texts.length];
    // Set initial states
    this.text1.style.opacity = '100%';
    this.text1.style.filter = '';
    this.text2.style.opacity = '0%';
    this.text2.style.filter = '';
    this.animate();
  }

  doMorph(dt: number) {
    this.morph += dt;
    let fraction = this.morph / this.morphTime;

    if (fraction > 1) {
      this.cooldown = this.cooldownTime;
      fraction = 1;
    }
    this.setStyles(fraction);
    if (fraction === 1) {
      this.textIndex++;
      this.morph = 0;
    }
  }

  setStyles(fraction: number) {
    // text2 is entering (opacity 0 -> 100, blur 8 -> 0)
    this.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    this.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    // text1 is leaving (opacity 100 -> 0, blur 0 -> 8)
    fraction = 1 - fraction;
    this.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    this.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    // Update text content when completely hidden/shown to prepare for next cycle
    this.text1.textContent = this.texts[this.textIndex % this.texts.length];
    this.text2.textContent = this.texts[(this.textIndex + 1) % this.texts.length];
  }

  doCooldown() {
    this.morph = 0;
    // Ensure clean states during cooldown
    this.text2.style.filter = '';
    this.text2.style.opacity = '100%';
    this.text1.style.filter = '';
    this.text1.style.opacity = '0%';
  }

  animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    let newTime = new Date();
    let dt = (newTime.getTime() - this.time.getTime()) / 1000;
    this.time = newTime;

    this.cooldown -= dt;

    if (this.cooldown <= 0) this.doMorph(dt);
    else this.doCooldown();
  };

  destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

const MorphingText: React.FC<MorphingTextProps> = ({ texts, className = '' }) => {
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const morphingInstanceRef = useRef<MorphingTextClass | null>(null);

  useEffect(() => {
    if (text1Ref.current && text2Ref.current) {
      morphingInstanceRef.current = new MorphingTextClass(texts, text1Ref.current, text2Ref.current);
    }

    return () => {
      if (morphingInstanceRef.current) {
        morphingInstanceRef.current.destroy();
      }
    };
  }, [texts]);

  return (
    <div className="relative h-24 md:h-32 w-full flex items-center justify-center">
      <div
        id="morph-container"
        className={`font-bold text-foreground leading-none ${className}`}
        style={{ 
          filter: 'url(#threshold) blur(0.6px)',
          position: 'relative',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <span
          ref={text1Ref}
          className="morph-text"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'inline-block',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            margin: '0 auto',
          }}
        ></span>
        <span
          ref={text2Ref}
          className="morph-text"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'inline-block',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            margin: '0 auto',
          }}
        ></span>
      </div>
    </div>
  );
};

export default MorphingText;

