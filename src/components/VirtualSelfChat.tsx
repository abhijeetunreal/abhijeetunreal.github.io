import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Brain, Send } from 'lucide-react';
import content from '@/data/content.json';
import { Project } from '@/types/content';
import { useToast } from '@/hooks/use-toast';
import { generateChatResponse } from '@/lib/gemini-client';
import DecoderText from './ui/DecoderText';

type Message = {
    sender: 'user' | 'ai';
    text: string;
}

const VirtualSelfChat = ({ projects }: { projects: Project[] }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isFirstInteraction, setIsFirstInteraction] = useState(true);
    const scrollContainerRef = useRef<null | HTMLDivElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isTyping]);

    const createPortfolioContext = () => {
        return `
            About: ${content.about.paragraph1}
            
            Projects: ${projects.map(p => `${p.title}: ${p.description} (Skills: ${p.tags.join(', ')})`).join('; ')}
            
            Design Philosophy: ${content.about.paragraph2}
            
            Companies worked with: ${content.workedWith.companies.join(', ')}
        `;
    };

    const generateAiResponse = async (message: string): Promise<string> => {
        try {
            console.log('Calling Gemini API...');
            const context = createPortfolioContext();
            const prompt = `
                Context about me: ${context}
                
                Previous conversation:
                ${messages.map(m => `${m.sender}: ${m.text}`).join('\n')}
                
                User: ${message}
                Assistant:`;

            const response = await generateChatResponse(prompt);
            return response;

        } catch (error) {
            console.error('Error generating AI response:', error);
            toast({
                title: "AI Response Error",
                description: "Failed to get AI response. Please try again.",
                variant: "destructive",
            });
            
            return "I'm experiencing some technical difficulties right now. Please try asking your question again, or feel free to explore the portfolio to learn more about my work and experience.";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isTyping) return;

        const userMessage: Message = { sender: 'user', text: inputValue };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = inputValue;
        setInputValue('');
        setIsTyping(true);

        try {
            const aiResponseText = await generateAiResponse(currentInput);
            const aiMessage: Message = { sender: 'ai', text: aiResponseText };
            setMessages(prev => [...prev, aiMessage]);
            
            if (isFirstInteraction) {
                setIsFirstInteraction(false);
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = { 
                sender: 'ai', 
                text: "I'm having trouble connecting right now. Please try again in a moment." 
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="bg-card/20 backdrop-blur-md border border-foreground/10 rounded-3xl p-6 flex flex-col h-[60vh] max-h-[500px]">
            <div className="flex justify-center items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-sm uppercase font-bold text-muted-foreground">[Ask My Digital Self]</h3>
            </div>
            <div ref={scrollContainerRef} className="flex-grow overflow-y-auto pr-4 mb-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-lg px-4 py-2 max-w-[80%] ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                           {msg.sender === 'ai' ? (
                                <DecoderText text={msg.text} className="prose prose-sm max-w-none dark:prose-invert" />
                            ) : (
                                <div className="prose prose-sm max-w-none dark:prose-invert" 
                                    dangerouslySetInnerHTML={{ 
                                        __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                        .replace(/\n/g, '<br/>') 
                                    }} />
                            )}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                         <div className="rounded-lg px-4 py-2 bg-muted">
                            <span className="animate-pulse">Thinking...</span>
                        </div>
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={content.aiChat.promptPlaceholder}
                    disabled={isTyping}
                    className="flex-grow"
                />
                <Button type="submit" size="icon" disabled={isTyping || !inputValue.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
};

export default VirtualSelfChat;
