import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import VirtualSelfChat from './VirtualSelfChat';
import { Project } from '@/types/content';

// Custom Neural Network Icon Component (same as in VirtualSelfChat)
const NeuralNetworkIcon = () => {
    return (
        <div className="relative h-6 w-6">
            {/* Neural Network Nodes */}
            <div className="absolute inset-0 flex items-center justify-center">
                {/* Central Node */}
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse" 
                     style={{ animationDuration: '3s' }} />
                
                {/* Orbiting Nodes */}
                <div className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-spin"
                     style={{ 
                         animationDuration: '8s',
                         top: '-3px',
                         left: '50%',
                         transform: 'translateX(-50%)'
                     }} />
                
                <div className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-spin"
                     style={{ 
                         animationDuration: '12s',
                         animationDirection: 'reverse',
                         bottom: '-3px',
                         left: '50%',
                         transform: 'translateX(-50%)'
                     }} />
                
                <div className="absolute w-2 h-2 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full animate-spin"
                     style={{ 
                         animationDuration: '10s',
                         right: '-3px',
                         top: '50%',
                         transform: 'translateY(-50%)'
                     }} />
                
                <div className="absolute w-2 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-spin"
                     style={{ 
                         animationDuration: '15s',
                         animationDirection: 'reverse',
                         left: '-3px',
                         top: '50%',
                         transform: 'translateY(-50%)'
                     }} />
                
                {/* Diagonal Nodes */}
                <div className="absolute w-1.5 h-1.5 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-pulse"
                     style={{ 
                         animationDuration: '4s',
                         top: '-1.5px',
                         right: '-1.5px'
                     }} />
                
                <div className="absolute w-1.5 h-1.5 bg-gradient-to-r from-teal-400 to-green-500 rounded-full animate-pulse"
                     style={{ 
                         animationDuration: '5s',
                         bottom: '-1.5px',
                         right: '-1.5px'
                     }} />
                
                <div className="absolute w-1.5 h-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"
                     style={{ 
                         animationDuration: '6s',
                         bottom: '-1.5px',
                         left: '-1.5px'
                     }} />
                
                <div className="absolute w-1.5 h-1.5 bg-gradient-to-r from-pink-400 to-red-500 rounded-full animate-pulse"
                     style={{ 
                         animationDuration: '7s',
                         top: '-1.5px',
                         left: '-1.5px'
                     }} />
            </div>
            
            {/* Neural Connections - Subtle Lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 24 24">
                {/* Central connections */}
                <line x1="12" y1="12" x2="12" y2="3" stroke="url(#gradient1)" strokeWidth="0.6" opacity="0.3">
                    <animate attributeName="opacity" values="0.1;0.4;0.1" dur="4s" repeatCount="indefinite" />
                </line>
                <line x1="12" y1="12" x2="12" y2="21" stroke="url(#gradient2)" strokeWidth="0.6" opacity="0.3">
                    <animate attributeName="opacity" values="0.1;0.4;0.1" dur="6s" repeatCount="indefinite" />
                </line>
                <line x1="12" y1="12" x2="21" y2="12" stroke="url(#gradient3)" strokeWidth="0.6" opacity="0.3">
                    <animate attributeName="opacity" values="0.1;0.4;0.1" dur="5s" repeatCount="indefinite" />
                </line>
                <line x1="12" y1="12" x2="3" y2="12" stroke="url(#gradient4)" strokeWidth="0.6" opacity="0.3">
                    <animate attributeName="opacity" values="0.1;0.4;0.1" dur="7s" repeatCount="indefinite" />
                </line>
                
                {/* Diagonal connections */}
                <line x1="12" y1="12" x2="21" y2="3" stroke="url(#gradient5)" strokeWidth="0.4" opacity="0.2">
                    <animate attributeName="opacity" values="0.05;0.3;0.05" dur="8s" repeatCount="indefinite" />
                </line>
                <line x1="12" y1="12" x2="21" y2="21" stroke="url(#gradient6)" strokeWidth="0.4" opacity="0.2">
                    <animate attributeName="opacity" values="0.05;0.3;0.05" dur="9s" repeatCount="indefinite" />
                </line>
                <line x1="12" y1="12" x2="3" y2="21" stroke="url(#gradient7)" strokeWidth="0.4" opacity="0.2">
                    <animate attributeName="opacity" values="0.05;0.3;0.05" dur="10s" repeatCount="indefinite" />
                </line>
                <line x1="12" y1="12" x2="3" y2="3" stroke="url(#gradient8)" strokeWidth="0.4" opacity="0.2">
                    <animate attributeName="opacity" values="0.05;0.3;0.05" dur="11s" repeatCount="indefinite" />
                </line>
                
                {/* Gradient definitions */}
                <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.6" />
                    </linearGradient>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0.6" />
                    </linearGradient>
                    <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#34d399" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.6" />
                    </linearGradient>
                    <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0.6" />
                    </linearGradient>
                    <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient id="gradient6" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient id="gradient7" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient id="gradient8" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#34d399" stopOpacity="0.4" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

interface StickyChatProps {
    projects: Project[];
}

const StickyChat = ({ projects }: StickyChatProps) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
    const iconRef = useRef<HTMLButtonElement>(null);

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
                className={`fixed bottom-6 right-6 z-[90] h-14 w-14 rounded-full bg-transparent text-primary-foreground shadow-lg hover:bg-transparent/90 transition-all duration-200 hover:scale-110 ${
                    isChatOpen ? 'scale-110' : ''
                }`}
                size="icon"
            >
                <NeuralNetworkIcon />
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