import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import VirtualSelfChat from './VirtualSelfChat';
import { Project } from '@/types/content';

interface StickyChatProps {
    projects: Project[];
}

const StickyChat = ({ projects }: StickyChatProps) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
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
                className={`fixed bottom-6 right-6 z-[90] h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-110 ${
                    isChatOpen ? 'scale-110' : ''
                }`}
                size="icon"
            >
                <MessageCircle className="h-6 w-6" />
            </Button>

            {/* Chat Modal */}
            <VirtualSelfChat
                projects={projects}
                isOpen={isChatOpen}
                onClose={closeChat}
                isSticky={true}
            />
        </>
    );
};

export default StickyChat; 