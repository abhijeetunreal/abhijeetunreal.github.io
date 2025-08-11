import content from '@/data/content.json';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Project } from '@/types/content';

interface ExperimentalProjectDetailProps {
    project: Project;
    onBack: () => void;
    onNextProject?: () => void;
    onPreviousProject?: () => void;
    hasNextProject?: boolean;
    hasPreviousProject?: boolean;
    onNavigateToAbout: () => void;
    onNavigateToExperimental: () => void;
    onNavigateToBlog: () => void;
}

const ExperimentalProjectDetail: React.FC<ExperimentalProjectDetailProps> = ({ 
    project, 
    onBack, 
    onNextProject, 
    onPreviousProject, 
    hasNextProject = false, 
    hasPreviousProject = false,
    onNavigateToAbout,
    onNavigateToExperimental,
    onNavigateToBlog
}) => {

    return (
        <div className="text-foreground min-h-screen font-mono relative z-[60]">
            <Header onGoHome={onBack} onGoToAbout={onNavigateToAbout} currentSection="EXPERIMENTAL" />
            <main className="container mx-auto px-4 pt-24 md:pt-32 pb-16">
                
                
                <div>
                    <div className="mb-8">
                        <Button onClick={onBack} variant="ghost" className="mb-8 px-0 hover:bg-transparent text-foreground">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to experimental projects
                        </Button>


                        {/* Hero Image Section */}
                {(project.heroImage || project.cardImage) && (
                    <div className="mb-12">
                        <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
                            <img
                                src={project.heroImage || project.cardImage}
                                alt={project.title}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                )}
                        
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">{project.title}</h1>
                        <div className="flex flex-wrap gap-2 mb-8">
                            {project.tags.map(tag => (
                                <Badge key={tag} variant="secondary">{tag}</Badge>
                            ))}
                        </div>
                    </div>
    
                    <div className="space-y-6 text-lg text-foreground">
                        <p>{project.fullDescription}</p>
                        
                        <h3 className="text-2xl font-bold text-foreground pt-8">[DESIGN PROCESS]</h3>

                        {/* Additional Image after Design Process Title */}
                        {project.designProcessImage && (
                            <div className="w-full overflow-hidden rounded-lg shadow-lg my-8">
                                <img
                                    src={project.designProcessImage}
                                    alt={`${project.title} Design Process`}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        )}

                        <p>{project.designProcess}</p>
                        
                        <h3 className="text-2xl font-bold text-foreground pt-8">[TECHNICAL DETAILS]</h3>
                        <p>{project.technicalDetails}</p>

                        {project.sections && project.sections.length > 0 && (
                            <>
                                <h3 className="text-2xl font-bold text-foreground pt-8">[PROJECT SHOWCASE]</h3>
                                <div className="space-y-8">
                                    {project.sections.map((section, index) => (
                                        <div key={index}>
                                            {section.type === 'image' && section.src && (
                                                <div className="rounded-lg overflow-hidden">
                                                    <img 
                                                        src={section.src} 
                                                        alt={section.alt || `Project image ${index + 1}`}
                                                        className="w-full h-auto object-cover"
                                                    />
                                                </div>
                                            )}
                                            {section.type === 'paragraph' && section.content && (
                                                <p className="text-foreground leading-relaxed">
                                                    {section.content}
                                                </p>
                                            )}
                                            {section.type === 'youtube-video' && section.youtubeUrl && (
                                                <div className="rounded-lg overflow-hidden">
                                                    <iframe
                                                        src={section.youtubeUrl.replace('watch?v=', 'embed/')}
                                                        title={`${project.title} Video`}
                                                        className="w-full aspect-video"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                </div>
                                            )}
                                            {section.type === 'external-links' && section.externalLinks && (
                                                <div className="space-y-3">
                                                    <h4 className="text-xl font-semibold text-foreground">External Resources</h4>
                                                    <div className="flex flex-wrap gap-3">
                                                        {section.externalLinks.map((link, linkIndex) => (
                                                            <a
                                                                key={linkIndex}
                                                                href={link.href}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                                                            >
                                                                {link.label}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Project Navigation */}
                    {(hasNextProject || hasPreviousProject) && (
                        <div className="mt-16 pt-8 border-t border-border">
                            <div className="flex justify-between items-center">
                                {hasPreviousProject && onPreviousProject ? (
                                    <Button 
                                        onClick={onPreviousProject} 
                                        variant="ghost" 
                                        className="flex items-center gap-2 hover:bg-transparent text-foreground"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        <span className="hidden sm:inline">Previous Project</span>
                                    </Button>
                                ) : (
                                    <div></div>
                                )}
                                
                                {hasNextProject && onNextProject ? (
                                    <Button 
                                        onClick={onNextProject} 
                                        variant="ghost" 
                                        className="flex items-center gap-2 hover:bg-transparent text-foreground"
                                    >
                                        <span className="hidden sm:inline">Next Project</span>
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

export default ExperimentalProjectDetail;
