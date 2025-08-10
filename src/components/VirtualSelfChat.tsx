import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Brain, Send, X } from 'lucide-react';
import content from '@/data/content.json';
import { Project } from '@/types/content';
import { useToast } from '@/hooks/use-toast';
import { generateChatResponse, testGeminiConnection } from '@/lib/gemini-client';
import DecoderText from './ui/DecoderText';

type Message = {
    sender: 'user' | 'ai';
    text: string;
}

interface VirtualSelfChatProps {
    projects: Project[];
    isOpen?: boolean;
    onClose?: () => void;
    isSticky?: boolean;
}

const VirtualSelfChat = ({ projects, isOpen = true, onClose, isSticky = false }: VirtualSelfChatProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isFirstInteraction, setIsFirstInteraction] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isApiConnected, setIsApiConnected] = useState<boolean | null>(null);
    const scrollContainerRef = useRef<null | HTMLDivElement>(null);
    const { toast } = useToast();

    // Initialize API connection state as null (unknown) - will be tested on first user interaction
    useEffect(() => {
        setIsApiConnected(null);
    }, []);

    useEffect(() => {
        const scrollToBottom = () => {
            if (scrollContainerRef.current) {
                const scrollElement = scrollContainerRef.current;
                const scrollHeight = scrollElement.scrollHeight;
                const clientHeight = scrollElement.clientHeight;
                const currentScrollTop = scrollElement.scrollTop;
                const maxScrollTop = scrollHeight - clientHeight;
                
                // Only scroll if content is going beyond the visible area
                if (currentScrollTop < maxScrollTop - 50) {
                    scrollElement.scrollTo({
                        top: maxScrollTop,
                        behavior: 'smooth'
                    });
                }
            }
        };

        // Scroll immediately when messages change
        scrollToBottom();
        
        // Check scroll position during animation
        const timeouts = [
            setTimeout(scrollToBottom, 100),
            setTimeout(scrollToBottom, 250),
            setTimeout(scrollToBottom, 500),
            setTimeout(scrollToBottom, 800)
        ];
        
        return () => timeouts.forEach(clearTimeout);
    }, [messages, isTyping, isAnimating]);

    // Continuous scroll during text animation
    useEffect(() => {
        if (isAnimating) {
            const scrollInterval = setInterval(() => {
                if (scrollContainerRef.current) {
                    const scrollElement = scrollContainerRef.current;
                    const scrollHeight = scrollElement.scrollHeight;
                    const clientHeight = scrollElement.clientHeight;
                    const maxScrollTop = scrollHeight - clientHeight;
                    
                    scrollElement.scrollTo({
                        top: maxScrollTop,
                        behavior: 'smooth'
                    });
                }
            }, 150); // Scroll every 150ms during animation

            return () => clearInterval(scrollInterval);
        }
    }, [isAnimating]);

    const createPortfolioContext = () => {
        return `
            PERSONAL BACKGROUND:
            - Name: ${content.name}
            - Hero Statement: ${content.hero.title}
            
            ABOUT ME:
            - Main Description: ${content.about.paragraph1}
            - Design Philosophy: ${content.about.paragraph2}
            - Design Philosophies: ${content.about.philosophies.map(p => p.statement).join('; ')}
            
            EDUCATION:
            ${content.aboutPage.education.map(edu => 
                `- ${edu.degree} from ${edu.institution} (${edu.year}): ${edu.description}`
            ).join('\n')}
            
            EXPERIENCE:
            ${content.aboutPage.experience.map(exp => 
                `- ${exp.role} at ${exp.company} (${exp.duration}): ${exp.description}`
            ).join('\n')}
            
            SKILLS:
            - Design Skills: ${content.aboutPage.skills.design.join(', ')}
            - Technology Skills: ${content.aboutPage.skills.technology.join(', ')}
            - Tools: ${content.aboutPage.skills.tools.join(', ')}
            
            INTERESTS:
            ${content.aboutPage.interests.join(', ')}
            
            AWARDS:
            ${content.aboutPage.awards.map(award => 
                `- ${award.title} from ${award.organization}: ${award.description}`
            ).join('\n')}
            
            MAIN PROJECTS:
            ${content.projects.map(p => 
                `- ${p.title}: ${p.description}. Full Description: ${p.fullDescription}. Design Process: ${p.designProcess}. Technical Details: ${p.technicalDetails}. Skills Used: ${p.tags.join(', ')}`
            ).join('\n\n')}
            
            EXPERIMENTAL PROJECTS:
            ${content.experimentalProjects.map(p => 
                `- ${p.title}: ${p.description}. Full Description: ${p.fullDescription}. Design Process: ${p.designProcess}. Technical Details: ${p.technicalDetails}. Skills Used: ${p.tags.join(', ')}`
            ).join('\n\n')}
            
            BLOG POSTS:
            ${content.blogPosts.map(blog => 
                `- ${blog.title}: ${blog.description}. Full Description: ${blog.fullDescription}. Design Process: ${blog.designProcess}. Technical Details: ${blog.technicalDetails}. Topics: ${blog.tags.join(', ')}`
            ).join('\n\n')}
            
            COMPANIES WORKED WITH:
            ${content.workedWith.companies.map(c => c.name).join(', ')}
            
            AI PHILOSOPHY CONTEXT:
            ${content.aiPhilosophy.context}
            
            CURRENT PROJECTS (from props):
            ${projects.map(p => `${p.title}: ${p.description} (Skills: ${p.tags.join(', ')})`).join('; ')}
        `;
    };

    const generateAiResponse = async (message: string): Promise<string> => {
        try {
            // Test API connection on first user interaction only
            if (isApiConnected === null) {
                try {
                    const connected = await testGeminiConnection();
                    setIsApiConnected(connected);
                    if (!connected) {
                        throw new Error('API connection failed');
                    }
                } catch (error) {
                    setIsApiConnected(false);
                    throw error;
                }
            }

            // If API is not connected, use fallback responses
            if (isApiConnected === false) {
                throw new Error('API not available');
            }

            const context = createPortfolioContext();
            const prompt = `
                You are my digital self - a virtual representation of me based on my comprehensive portfolio information. Respond directly and naturally as if you are me, speaking in first person.

                I have extensive knowledge about:
                - My personal background, education, and experience
                - All my projects (main projects and experimental projects)
                - My blog posts and articles
                - My skills, tools, and technologies
                - My design philosophy and approach
                - Companies I've worked with
                - My awards and achievements
                - My interests and specializations

                My complete background and context: ${context}
                
                Previous conversation:
                ${messages.map(m => `${m.sender === 'user' ? 'Visitor' : 'Me'}: ${m.text}`).join('\n')}
                
                A visitor to my portfolio asks: ${message}
                
                Respond directly as me, drawing from my comprehensive knowledge. You can discuss any of my projects, blog posts, skills, experience, or philosophy. Be specific and detailed when discussing my work. Do not add any introductory phrases like "Okay, sure!" or "Here's my response". Just answer naturally and conversationally. Be authentic, professional, and helpful.`;

            const response = await generateChatResponse(prompt);
            return response;

        } catch (error) {
            
            // Provide fallback responses when API is unavailable
            const fallbackResponses = [
                "I'd be happy to help! I'm a passionate product designer and technologist with extensive experience in UX design, AI integration, and emerging technologies. I've worked on projects ranging from aerospace interfaces to AI-powered creative tools. Feel free to ask me about any of my projects, blog posts, or experience!",
                "Great question! I specialize in creating innovative digital experiences and have worked on everything from mindfulness wearables to AI art platforms. I've written about AI in design, metaverse experiences, and sustainable digital design. What would you like to know about my work?",
                "That's an interesting question! I love working on challenging projects that push boundaries - from brain-computer interfaces to climate data visualization. I've worked with companies like Airbus and have expertise in React, Three.js, and AI technologies. My portfolio showcases my diverse range of work.",
                "I'm excited to share more about my experience! I've worked with various companies and technologies, always focusing on creating impactful solutions. I have projects in fintech, document management, mentorship platforms, and AI-powered tools. What interests you most?",
                "Thanks for asking! I'm constantly learning and experimenting with new technologies. I have a Bachelor's in Design from NID, experience at Airbus, and have created projects spanning from mobile apps to interactive installations. My blog covers topics from AI in design to sustainable digital practices."
            ];
            
            // Select a random fallback response
            const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
            
            // Provide more specific error messages based on the error type
            let errorMessage = randomResponse;
            
            if (error instanceof Error) {
                if (error.message.includes('API request failed')) {
                    if (error.message.includes('429')) {
                        errorMessage = "I've reached my daily AI response limit, but I'd be happy to help! You can explore my portfolio to learn more about my work and experience. Feel free to ask me anything about my projects!";
                    } else {
                        errorMessage = "I'm having trouble connecting to my AI service. Please check your internet connection and try again.";
                    }
                } else if (error.message.includes('Content blocked')) {
                    errorMessage = "I couldn't process that request due to content restrictions. Please try rephrasing your question.";
                } else if (error.message.includes('VITE_GEMINI_API_KEY')) {
                    errorMessage = "AI service is not properly configured. Please contact the developer.";
                }
            }
            
            toast({
                title: "AI Service Limited",
                description: "Using fallback responses due to API quota limits. Please try again tomorrow or explore the portfolio.",
                variant: "default",
            });
            
            return errorMessage;
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
            setIsAnimating(true);
            
            if (isFirstInteraction) {
                setIsFirstInteraction(false);
            }
        } catch (error) {
            const errorMessage: Message = { 
                sender: 'ai', 
                text: "I'm having trouble connecting right now. Please try again in a moment." 
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const chatContent = (
        <div className="bg-card/20 backdrop-blur-md border border-foreground/10 rounded-3xl p-6 flex flex-col h-[60vh] max-h-[500px]">
            <div className="flex justify-between items-center mb-4">
                <div className="flex justify-center items-center gap-2">
                    <Brain className="h-5 w-5 " />
                    <h3 className="text-sm uppercase font-bold ">[Ask My Digital Self - Knows Everything]</h3>
                    {isApiConnected === false && (
                        <div className="flex items-center gap-1 text-xs text-orange-500">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span>Limited</span>
                        </div>
                    )}
                    {isApiConnected === true && (
                        <div className="flex items-center gap-1 text-xs text-green-500">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Online</span>
                        </div>
                    )}
                </div>
                {isSticky && onClose && (
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-transparent  hover:text-foreground transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <div ref={scrollContainerRef} className="flex-grow overflow-y-auto pr-4 mb-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-lg px-4 py-2 max-w-[80%] ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                           {msg.sender === 'ai' ? (
                                <DecoderText 
                                    text={msg.text} 
                                    className="prose prose-sm max-w-none dark:prose-invert"
                                    onAnimationProgress={(progress) => {
                                        if (progress >= 1) {
                                            setIsAnimating(false);
                                        }
                                    }}
                                />
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
                    placeholder={isApiConnected === false ? "Ask me anything (using fallback responses)" : "Ask about my projects, blog posts, skills, experience, or philosophy..."}
                    disabled={isTyping}
                    className="flex-grow"
                />
                <Button type="submit" size="icon" disabled={isTyping || !inputValue.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );

    if (isSticky) {
        return isOpen ? (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="w-full max-w-2xl">
                    {chatContent}
                </div>
            </div>
        ) : null;
    }

    return chatContent;
};

export default VirtualSelfChat;
