import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import content from '@/data/content.json';
import { Project } from '@/types/content';
import { useToast } from '@/hooks/use-toast';
import { generateChatResponse, testGeminiConnection } from '@/lib/gemini-client';
import DecoderText from './ui/DecoderText';

// Animated Eye Component - Same as StickyChat with cursor following and blinking
const AnimatedEye = () => {
    const [isBlinking, setIsBlinking] = useState(false);
    const [blinkCount, setBlinkCount] = useState(0);
    const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
    const blinkTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Calculate distance from center of the eye
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            // Calculate distance from center
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            
            // Realistic eye movement constraints
            const maxMove = 2; // Smaller movement for the smaller eye
            const moveX = Math.max(-maxMove, Math.min(maxMove, deltaX * 0.02));
            const moveY = Math.max(-maxMove, Math.min(maxMove, deltaY * 0.02));
            
            setEyePosition({ x: moveX, y: moveY });
        };

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

        // Always track mouse movement across the entire screen
        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            // Clean up the timer and event listener when component unmounts
            if (blinkTimerRef.current) {
                clearTimeout(blinkTimerRef.current);
            }
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []); // Empty dependency array ensures this only runs once

    return (
        <div className="relative h-6 w-6 flex items-center justify-center">
            {/* Eye Container */}
            <div className="relative w-6 h-6">
                {/* Eye Socket Shadow */}
                <div className="absolute inset-0 w-6 h-6 bg-gradient-to-br from-gray-800/40 to-gray-600/20 rounded-full blur-sm" />
                
                {/* Eye White with 3D depth - Larger to fill container */}
                <div className="w-7 h-7 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-full shadow-md border border-gray-300 relative overflow-hidden -ml-0.5 -mt-0.5">
                    {/* Eye Shine/Reflection */}
                    <div className="absolute top-1.5 left-1.5 w-2 h-2 bg-gradient-to-br from-white via-blue-50 to-transparent rounded-full opacity-90" />
                    <div className="absolute top-2 left-2 w-0.5 h-0.5 bg-white rounded-full opacity-100" />
                    
                    {/* Secondary reflection */}
                    <div className="absolute top-2.5 right-1.5 w-0.5 h-0.5 bg-gradient-to-br from-white to-transparent rounded-full opacity-60" />
                    
                    {/* Iris with 3D depth */}
                    <div 
                        className="absolute top-1/2 left-1/2 w-5 h-5 bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ease-out shadow-inner"
                        style={{ 
                            transform: `translate(calc(-50% + ${eyePosition.x}px), calc(-50% + ${eyePosition.y}px))` 
                        }}
                    >
                        {/* Iris texture and depth */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-400" />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500/80 via-transparent to-cyan-300/80" />
                        
                        {/* Iris rings for depth */}
                        <div className="absolute inset-1 rounded-full border border-emerald-400/40" />
                        
                        {/* Pupil with depth */}
                        <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-gradient-to-br from-black via-gray-900 to-black rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-inner" />
                        
                        {/* Pupil highlight */}
                        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white rounded-full opacity-80" />
                        
                        {/* Iris highlight */}
                        <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-gradient-to-br from-white via-emerald-100 to-transparent rounded-full opacity-70" />
                    </div>
                    
                    {/* Eyelid with 3D effect */}
                    <div className="absolute top-0 left-0 w-7 h-7 bg-gradient-to-b from-transparent via-gray-50/30 to-gray-200/40 rounded-full" />
                    <div className="absolute top-0 left-0 w-7 h-7 bg-gradient-to-b from-transparent via-transparent to-white/20 rounded-full" />
                    
                    {/* Eye corner shadows */}
                    <div className="absolute top-1.5 left-1.5 w-1 h-1 bg-gradient-to-br from-gray-300/40 to-transparent rounded-full" />
                    <div className="absolute top-1.5 right-1.5 w-1 h-1 bg-gradient-to-bl from-gray-300/40 to-transparent rounded-full" />
                </div>
                
                {/* Blinking Eyelid - Animated - Larger to overflow */}
                <div 
                    className={`absolute top-0 left-0 w-7 h-7 bg-gradient-to-b from-gray-100/90 via-gray-200/80 to-gray-300/70 rounded-full transition-all duration-100 ease-out -ml-0.5 -mt-0.5 ${
                        isBlinking ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
                    }`}
                    style={{ 
                        transformOrigin: 'top',
                        transform: isBlinking ? 'scaleY(1)' : 'scaleY(0)'
                    }}
                />
                

                
                {/* 3D shadow under eye - Larger to overflow */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-5 h-1.5 bg-gradient-to-t from-gray-400/40 via-gray-300/20 to-transparent rounded-full blur-sm" />
                
                {/* Eye socket highlight - Larger to overflow */}
                <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-5 h-1.5 bg-gradient-to-b from-white/30 via-transparent to-transparent rounded-full blur-sm" />
            </div>
        </div>
    );
};

type Message = {
    sender: 'user' | 'ai';
    text: string;
}

interface VirtualSelfChatProps {
    projects: Project[];
    isOpen?: boolean;
    onClose?: () => void;
    isSticky?: boolean;
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const VirtualSelfChat = ({ projects, isOpen = true, onClose, isSticky = false, messages, setMessages }: VirtualSelfChatProps) => {
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isFirstInteraction, setIsFirstInteraction] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isApiConnected, setIsApiConnected] = useState<boolean | null>(null);
    const scrollContainerRef = useRef<null | HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { toast } = useToast();
    const [newMessageIds, setNewMessageIds] = useState<Set<number>>(new Set());

    // Initialize API connection state as null (unknown) - will be tested on first user interaction
    useEffect(() => {
        setIsApiConnected(null);
    }, []);

    // Track new messages when they're added
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessageIndex = messages.length - 1;
            setNewMessageIds(prev => new Set([...prev, lastMessageIndex]));
        }
    }, [messages.length]);

    // Clear new message tracking when chat is opened
    useEffect(() => {
        if (isOpen) {
            setNewMessageIds(new Set());
        }
    }, [isOpen]);

    // Auto-resize textarea based on content
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [inputValue]);

    // Enhanced scroll to bottom functionality
    useEffect(() => {
        const scrollToBottom = () => {
            if (scrollContainerRef.current) {
                const scrollElement = scrollContainerRef.current;
                const scrollHeight = scrollElement.scrollHeight;
                const clientHeight = scrollElement.clientHeight;
                const currentScrollTop = scrollElement.scrollTop;
                const maxScrollTop = scrollHeight - clientHeight;
                
                // Always scroll to bottom for new messages
                scrollElement.scrollTo({
                    top: maxScrollTop,
                    behavior: 'smooth'
                });
            }
        };

        // Scroll immediately when messages change
        scrollToBottom();
        
        // Additional scroll checks during animation
        const timeouts = [
            setTimeout(scrollToBottom, 100),
            setTimeout(scrollToBottom, 250),
            setTimeout(scrollToBottom, 500),
            setTimeout(scrollToBottom, 800)
        ];
        
        return () => timeouts.forEach(clearTimeout);
    }, [messages, isTyping, isAnimating]);

    // Continuous scroll during text animation for better user experience
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
            }, 100); // More frequent scrolling during animation

            return () => clearInterval(scrollInterval);
        }
    }, [isAnimating]);

    // Handle keydown events for the textarea
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (inputValue.trim() && !isTyping) {
                handleSubmit(e as any);
            }
        }
    };

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
                if (error.message.includes('VITE_GEMINI_API_KEY not configured')) {
                    errorMessage = "AI service is not configured yet. The developer needs to set up the Gemini API key. In the meantime, feel free to explore my portfolio and projects!";
                } else if (error.message.includes('API request failed')) {
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
            
            // Only show toast for API quota issues, not for configuration issues
            if (error instanceof Error && !error.message.includes('VITE_GEMINI_API_KEY not configured')) {
                toast({
                    title: "AI Service Limited",
                    description: "Using fallback responses due to API quota limits. Please try again tomorrow or explore the portfolio.",
                    variant: "default",
                });
            }
            
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
                    <h3 className="text-sm uppercase font-bold text-white dark:text-white">Ask My Digital Self</h3>
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
                        className="h-6 w-6 hover:bg-transparent hover:text-white dark:hover:text-foreground transition-colors text-white dark:text-foreground"
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
                                    shouldAnimate={newMessageIds.has(index)}
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
                <Textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isApiConnected === false ? "Ask me anything (using fallback responses)" : "Ask about my projects, blog posts, skills, experience, or philosophy..."}
                    disabled={isTyping}
                    className="flex-grow min-h-[40px] max-h-[120px] resize-none overflow-hidden border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md px-3 py-2"
                    style={{
                        transition: 'height 0.1s ease-out',
                        fontFamily: 'inherit'
                    }}
                />
                <Button type="submit" size="icon" disabled={isTyping || !inputValue.trim()} className="bg-transparent hover:bg-transparent border-0 shadow-none">
                    <AnimatedEye />
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
