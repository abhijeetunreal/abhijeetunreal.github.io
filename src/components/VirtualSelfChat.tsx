import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Brain, Send } from 'lucide-react';

type Project = {
  title: string;
  description: string;
  tags: string[];
};

type VirtualSelfChatProps = {
  projects: Project[];
};

type Message = {
    sender: 'user' | 'ai';
    text: string;
}

const generateAiResponse = (message: string, projects: Project[]): string => {
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
        return "Hello! I'm a virtual version of this portfolio's creator. You can ask me about their work, skills, or design philosophy.";
    }

    if (lowerCaseMessage.includes('project') || lowerCaseMessage.includes('work')) {
        const projectList = projects.map(p => p.title).join(', ');
        return `I've worked on several projects like ${projectList}. Which one would you like to know more about?`;
    }
    
    const projectMentioned = projects.find(p => lowerCaseMessage.includes(p.title.toLowerCase().replace('project ','')));
    if (projectMentioned) {
        return `${projectMentioned.title}: ${projectMentioned.description}. It involves skills like ${projectMentioned.tags.join(', ')}.`;
    }

    if (lowerCaseMessage.includes('about') || lowerCaseMessage.includes('who are you')) {
        return "I'm a designer driven by the convergence of disparate fields, blending technology and creativity to meet human needs. My process is a dialogue between human needs and technological possibilities.";
    }

    if (lowerCaseMessage.includes('contact')) {
        return "You can find contact links like Email, LinkedIn, and GitHub at the bottom of the page.";
    }

    if (lowerCaseMessage.includes('skill') || lowerCaseMessage.includes('tech')) {
         const allTags = [...new Set(projects.flatMap((p) => p.tags))];
         return `I have experience with various technologies and design principles, including: ${allTags.join(', ')}.`;
    }

    return "That's an interesting question. My knowledge is based on the projects and information on this site. Could you ask me something about the work you see here?";
}


const VirtualSelfChat = ({ projects }: VirtualSelfChatProps) => {
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: "Hello! I'm a digital consciousness, trained on this portfolio. Ask me anything about the creator's work or thoughts." }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isTyping) return;

        const userMessage: Message = { sender: 'user', text: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        setTimeout(() => {
            const aiResponseText = generateAiResponse(inputValue, projects);
            const aiMessage: Message = { sender: 'ai', text: aiResponseText };
            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1200); // Simulate thinking time
    };

    return (
        <div className="border-2 border-dashed border-border p-6 flex flex-col h-[60vh] max-h-[500px]">
            <div className="flex justify-center items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-muted-foreground animate-pulse" />
                <h3 className="text-sm uppercase font-bold text-muted-foreground">[Ask My Digital Self]</h3>
            </div>
            <div className="flex-grow overflow-y-auto pr-4 mb-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-lg px-4 py-2 max-w-[80%] ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                           {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                         <div className="rounded-lg px-4 py-2 bg-muted">
                            <span className="animate-pulse">...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about my work, skills, philosophy..."
                    disabled={isTyping}
                    className="flex-grow"
                />
                <Button type="submit" size="icon" disabled={isTyping}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
};

export default VirtualSelfChat;
