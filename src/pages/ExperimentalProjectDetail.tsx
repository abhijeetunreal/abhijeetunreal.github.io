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
                        <div className="rounded-lg overflow-hidden shadow-2xl">
                            <img 
                                src={project.heroImage || project.cardImage} 
                                alt={`${project.title} hero image`}
                                className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover"
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
