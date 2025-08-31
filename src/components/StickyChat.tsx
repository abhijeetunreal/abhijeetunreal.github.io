import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import VirtualSelfChat from './VirtualSelfChat';
import { Project } from '@/types/content';

// Animated Eye Component - Follows mouse cursor like watching with 3D effects and realistic blinking
const AnimatedEye = ({ eyePosition }: { eyePosition: { x: number; y: number } }) => {
    const [isBlinking, setIsBlinking] = useState(false);
    const [blinkCount, setBlinkCount] = useState(0);
    const blinkTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const blink = () => {
            setIsBlinking(true);
            // Natural blink duration between 150-300ms
            const blinkDuration = Math.random() * 150 + 150;
            setTimeout(() => setIsBlinking(false), blinkDuration);
        };

        const performBlinkSequence = () => {
            // Determine blink pattern based on natural probabilities
            const patternRoll = Math.random();
            
            if (patternRoll < 0.65) {
                // 65% chance: Single blink
                blink();
                setBlinkCount(prev => prev + 1);
            } else if (patternRoll < 0.85) {
                // 20% chance: Double blink (like when thinking or processing)
                blink();
                setBlinkCount(prev => prev + 1);
                setTimeout(() => {
                    blink();
                    setBlinkCount(prev => prev + 1);
                }, 200 + Math.random() * 150);
            } else if (patternRoll < 0.95) {
                // 10% chance: Triple blink (like when surprised or adjusting)
                blink();
                setBlinkCount(prev => prev + 1);
                setTimeout(() => {
                    blink();
                    setBlinkCount(prev => prev + 1);
                }, 180 + Math.random() * 120);
                setTimeout(() => {
                    blink();
                    setBlinkCount(prev => prev + 1);
                }, 400 + Math.random() * 200);
            } else {
                // 5% chance: Rapid flutter (like when tired or distracted)
                for (let i = 0; i < 4; i++) {
                    setTimeout(() => {
                        blink();
                        setBlinkCount(prev => prev + 1);
                    }, i * (100 + Math.random() * 50));
                }
            }
        };

        const scheduleNextBlink = () => {
            // Clear any existing timer
            if (blinkTimerRef.current) {
                clearTimeout(blinkTimerRef.current);
            }

            // Natural blinking intervals with variation
            let randomDelay;
            
            // 50% chance: Normal interval (2-3 seconds)
            if (Math.random() < 0.5) {
                randomDelay = Math.random() * 1000 + 2000;
            } 
            // 25% chance: Slightly longer (3-4 seconds)
            else if (Math.random() < 0.75) {
                randomDelay = Math.random() * 1000 + 3000;
            } 
            // 15% chance: Longer pause (4-6 seconds)
            else if (Math.random() < 0.9) {
                randomDelay = Math.random() * 2000 + 4000;
            } 
            // 10% chance: Extended pause (6-8 seconds) - like when focused
            else {
                randomDelay = Math.random() * 2000 + 6000;
            }

            blinkTimerRef.current = setTimeout(() => {
                performBlinkSequence();
                
                // Schedule the next blink after this sequence completes
                scheduleNextBlink();
            }, randomDelay);
        };

        // Start the blinking cycle
        scheduleNextBlink();

        return () => {
            // Clean up the timer when component unmounts
            if (blinkTimerRef.current) {
                clearTimeout(blinkTimerRef.current);
            }
        };
    }, []); // Empty dependency array ensures this only runs once

    return (
        <div className="relative h-16 w-16 flex items-center justify-center">
            {/* Eye Container */}
            <div className="relative w-14 h-14">
                {/* Eye Socket Shadow */}
                <div className="absolute inset-0 w-14 h-14 bg-gradient-to-br from-gray-800/40 to-gray-600/20 rounded-full blur-md" />
                
                {/* Eye White with 3D depth */}
                <div className="w-14 h-14 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-full shadow-2xl border-2 border-gray-300 relative overflow-hidden">
                    {/* Eye Shine/Reflection */}
                    <div className="absolute top-1 left-1 w-4 h-4 bg-gradient-to-br from-white via-blue-50 to-transparent rounded-full opacity-90" />
                    <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full opacity-100" />
                    
                    {/* Secondary reflection */}
                    <div className="absolute top-3 right-2 w-2 h-2 bg-gradient-to-br from-white to-transparent rounded-full opacity-60" />
                    
                    {/* Iris with 3D depth */}
                    <div 
                        className="absolute top-1/2 left-1/2 w-9 h-9 bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ease-out shadow-inner"
                        style={{ 
                            transform: `translate(calc(-50% + ${eyePosition.x}px), calc(-50% + ${eyePosition.y}px))` 
                        }}
                    >
                        {/* Iris texture and depth */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-400" />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500/80 via-transparent to-cyan-300/80" />
                        
                        {/* Iris rings for depth */}
                        <div className="absolute inset-1 rounded-full border border-emerald-400/40" />
                        <div className="absolute inset-2 rounded-full border border-emerald-300/30" />
                        
                        {/* Pupil with depth */}
                        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-gradient-to-br from-black via-gray-900 to-black rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-inner" />
                        
                        {/* Pupil highlight */}
                        <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full opacity-80" />
                        
                        {/* Iris highlight */}
                        <div className="absolute top-1 left-1 w-2 h-2 bg-gradient-to-br from-white via-emerald-100 to-transparent rounded-full opacity-70" />
                    </div>
                    
                    {/* Eyelid with 3D effect */}
                    <div className="absolute top-0 left-0 w-14 h-14 bg-gradient-to-b from-transparent via-gray-50/30 to-gray-200/40 rounded-full" />
                    <div className="absolute top-0 left-0 w-14 h-14 bg-gradient-to-b from-transparent via-transparent to-white/20 rounded-full" />
                    
                    {/* Eye corner shadows */}
                    <div className="absolute top-1 left-1 w-3 h-3 bg-gradient-to-br from-gray-300/40 to-transparent rounded-full" />
                    <div className="absolute top-1 right-1 w-3 h-3 bg-gradient-to-bl from-gray-300/40 to-transparent rounded-full" />
                </div>
                
                {/* Blinking Eyelid - Animated */}
                <div 
                    className={`absolute top-0 left-0 w-14 h-14 bg-gradient-to-b from-gray-100/90 via-gray-200/80 to-gray-300/70 rounded-full transition-all duration-100 ease-out ${
                        isBlinking ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
                    }`}
                    style={{ 
                        transformOrigin: 'top',
                        transform: isBlinking ? 'scaleY(1)' : 'scaleY(0)'
                    }}
                />
                
                {/* Eyelashes with 3D effect */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-2">
                    <div className="absolute top-0 left-0 w-1 h-2 bg-gradient-to-b from-gray-800 to-gray-600 transform rotate-12 shadow-lg" />
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-gradient-to-b from-gray-800 to-gray-600 shadow-lg" />
                    <div className="absolute top-0 right-0 w-1 h-2 bg-gradient-to-b from-gray-800 to-gray-600 transform -rotate-12 shadow-lg" />
                </div>
                
                {/* Bottom eyelashes */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-2">
                    <div className="absolute bottom-0 left-0 w-1 h-2 bg-gradient-to-t from-gray-800 to-gray-600 transform -rotate-12 shadow-lg" />
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-gradient-to-t from-gray-800 to-gray-600 shadow-lg" />
                    <div className="absolute bottom-0 right-0 w-1 h-2 bg-gradient-to-t from-gray-800 to-gray-600 transform rotate-12 shadow-lg" />
                </div>
                
                {/* 3D shadow under eye */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-gradient-to-t from-gray-400/40 via-gray-300/20 to-transparent rounded-full blur-md" />
                
                {/* Eye socket highlight */}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-b from-white/30 via-transparent to-transparent rounded-full blur-sm" />
            </div>
        </div>
    );
};

interface StickyChatProps {
    projects: Project[];
}

const StickyChat = ({ projects }: StickyChatProps) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
    const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
    const iconRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!iconRef.current) return;
            
            const rect = iconRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Calculate distance from center
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            
            // Realistic eye movement constraints - iris gets masked at edges
            // The iris can only move so far before it gets clipped by the eye socket
            const maxMove = 4; // Reduced for more realistic masking effect
            const moveX = Math.max(-maxMove, Math.min(maxMove, deltaX * 0.08));
            const moveY = Math.max(-maxMove, Math.min(maxMove, deltaY * 0.08));
            
            setEyePosition({ x: moveX, y: moveY });
        };

        // Always track mouse movement across the entire screen
        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const closeChat = () => {
        setIsChatOpen(false);
    };

    return (
        <>
            {/* Sticky Chat Icon */}
            <Button
                ref={iconRef}
                onClick={toggleChat}
                className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[90] h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-transparent backdrop-blur-sm text-foreground shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-110 ${
                    isChatOpen ? 'scale-110 shadow-emerald-500/40 ring-2 ring-emerald-300/50' : ''
                }`}
                size="icon"
                title="Chat with AI Assistant"
                aria-label="Open AI chat assistant"
            >
                <AnimatedEye eyePosition={eyePosition} />
            </Button>

            {/* Chat Modal */}
            <VirtualSelfChat
                projects={projects}
                isOpen={isChatOpen}
                onClose={closeChat}
                isSticky={true}
                messages={messages}
                setMessages={setMessages}
            />
        </>
    );
};

export default StickyChat; 