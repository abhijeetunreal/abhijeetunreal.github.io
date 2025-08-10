import content from '@/data/content.json';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Project } from '@/types/content';

interface BlogPostDetailProps {
    post: Project;
    onBack: () => void;
    onNextPost?: () => void;
    onPreviousPost?: () => void;
    hasNextPost?: boolean;
    hasPreviousPost?: boolean;
    onNavigateToAbout: () => void;
    onNavigateToExperimental: () => void;
    onNavigateToBlog: () => void;
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ 
    post, 
    onBack, 
    onNextPost, 
    onPreviousPost, 
    hasNextPost = false, 
    hasPreviousPost = false,
    onNavigateToAbout,
    onNavigateToExperimental,
    onNavigateToBlog
}) => {

    return (
        <div className="text-foreground min-h-screen font-mono relative z-[60]">
            <Header onGoHome={onBack} onGoToAbout={onNavigateToAbout} currentSection="BLOG" />
            <main className="container mx-auto px-4 pt-24 md:pt-32 pb-16">
                <div>
                    <div className="mb-8">
                        <Button onClick={onBack} variant="ghost" className="mb-8 px-0 hover:bg-transparent text-foreground">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to blog
                        </Button>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">{post.title}</h1>
                        <div className="flex flex-wrap gap-2 mb-8">
                            {post.tags.map(tag => (
                                <Badge key={tag} variant="secondary">{tag}</Badge>
                            ))}
                        </div>
                    </div>
    
                    <div className="space-y-6 text-lg text-foreground">
                        <p>{post.fullDescription}</p>
                        
                        <h3 className="text-2xl font-bold text-foreground pt-8">[RESEARCH APPROACH]</h3>
                        <p>{post.designProcess}</p>
                        
                        <h3 className="text-2xl font-bold text-foreground pt-8">[KEY FINDINGS]</h3>
                        <p>{post.technicalDetails}</p>

                        {post.sections && post.sections.length > 0 && (
                            <>
                                <h3 className="text-2xl font-bold text-foreground pt-8">[ARTICLE CONTENT]</h3>
                                <div className="space-y-8">
                                    {post.sections.map((section, index) => (
                                        <div key={index}>
                                            {section.type === 'image' && section.src && (
                                                <div className="rounded-lg overflow-hidden">
                                                    <img 
                                                        src={section.src} 
                                                        alt={section.alt || `Article image ${index + 1}`}
                                                        className="w-full h-auto object-cover"
                                                    />
                                                </div>
                                            )}
                                            {section.type === 'paragraph' && section.content && (
                                                <p className="text-foreground leading-relaxed">
                                                    {section.content}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Blog Post Navigation */}
                    {(hasNextPost || hasPreviousPost) && (
                        <div className="mt-16 pt-8 border-t border-border">
                            <div className="flex justify-between items-center">
                                {hasPreviousPost && onPreviousPost ? (
                                    <Button 
                                        onClick={onPreviousPost} 
                                        variant="ghost" 
                                        className="flex items-center gap-2 hover:bg-transparent text-foreground"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        <span className="hidden sm:inline">Previous Article</span>
                                    </Button>
                                ) : (
                                    <div></div>
                                )}
                                
                                {hasNextPost && onNextPost ? (
                                    <Button 
                                        onClick={onNextPost} 
                                        variant="ghost" 
                                        className="flex items-center gap-2 hover:bg-transparent text-foreground"
                                    >
                                        <span className="hidden sm:inline">Next Article</span>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                ) : (
                                    <div></div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer onNavigateToExperimental={onNavigateToExperimental} onNavigateToBlog={onNavigateToBlog} />
        </div>
    );
};

export default BlogPostDetail;
