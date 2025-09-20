
import content from '@/data/content.json';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Project } from '@/types/content';
import DetailMarquee from '@/components/DetailMarquee';
import AccordionProjects from '@/components/AccordionProjects';
import MediaDisplay from '@/components/ui/MediaDisplay';
import CustomSectionRenderer from '@/components/CustomSectionRenderer';

interface ProjectDetailProps {
    project: Project;
    onBack: () => void;
    onNextProject?: () => void;
    onPreviousProject?: () => void;
    hasNextProject?: boolean;
    hasPreviousProject?: boolean;
    onNavigateToExperimental: () => void;
    onGoToAbout: () => void;
    onNavigateToBlog: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ 
    project, 
    onBack, 
    onNextProject, 
    onPreviousProject, 
    hasNextProject = false, 
    hasPreviousProject = false,
    onNavigateToExperimental,
    onGoToAbout,
    onNavigateToBlog
}) => {

    return (
        <div className="text-foreground min-h-screen font-mono relative z-[60]">
            <Header onGoHome={onBack} onGoToAbout={onGoToAbout} currentSection="HOME" />
            <main className="container mx-auto px-4 pt-24 md:pt-32 pb-16">
                
                
                <div>
                    <div className="mb-8">
                        <Button onClick={onBack} variant="ghost" className="mb-8 px-0 hover:bg-transparent text-foreground">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to all projects
                        </Button>

                        {/* Hero Media Section */}
                        {(project.heroImage || project.cardImage || project.heroVideo || project.cardVideo) && (
                        <div className="mb-12">
                         <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
                            <MediaDisplay
                                src={project.heroImage || project.cardImage}
                                videoUrl={project.heroVideo || project.cardVideo}
                                alt={project.title}
                                className="w-full h-auto object-cover"
                                loop={true}
                                autoPlay={true}
                                muted={true}
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
                        {/* Inline marquee inserted right after hero image and before full description */}
                        {project.sections && project.sections.filter(s => s.type === 'marquee-inline' && s.position === 'top').map((section, idx) => (
                            section.marqueeInlineItems && section.marqueeInlineItems.length > 0 ? (
                                <DetailMarquee
                                    key={`top-inline-${idx}`}
                                    leftImage={section.marqueeInlineLeftImage || project.heroImage || project.cardImage || ''}
                                    leftAlt={project.title}
                                    items={section.marqueeInlineItems}
                                />
                            ) : null
                        ))}
                        <p>{project.fullDescription}</p>
                        {/* Inline marquee after description */}
                        {project.sections && project.sections.filter(s => s.type === 'marquee-inline' && s.position === 'after-description').map((section, idx) => (
                            section.marqueeInlineItems && section.marqueeInlineItems.length > 0 ? (
                                <DetailMarquee
                                    key={`after-desc-inline-${idx}`}
                                    leftImage={section.marqueeInlineLeftImage || project.heroImage || project.cardImage || ''}
                                    leftAlt={project.title}
                                    items={section.marqueeInlineItems}
                                />
                            ) : null
                        ))}
                        
                        {project.visibility?.designProcess !== false && (
                            <h3 className="text-2xl font-bold text-foreground pt-8">{project.labels?.designProcess || content.labels?.designProcess || 'DESIGN PROCESS'}</h3>
                        )}

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

                        {project.visibility?.designProcess !== false && (
                            <p>{project.designProcess}</p>
                        )}
                        
                        {/* Inline marquee between design and technical */}
                        {project.sections && project.sections.filter(s => s.type === 'marquee-inline' && s.position === 'between-design-and-technical').map((section, idx) => (
                            section.marqueeInlineItems && section.marqueeInlineItems.length > 0 ? (
                                <DetailMarquee
                                    key={`between-inline-${idx}`}
                                    leftImage={section.marqueeInlineLeftImage || project.heroImage || project.cardImage || ''}
                                    leftAlt={project.title}
                                    items={section.marqueeInlineItems}
                                />
                            ) : null
                        ))}

                        {project.visibility?.technicalDetails !== false && (
                            <>
                                <h3 className="text-2xl font-bold text-foreground pt-8">{project.labels?.technicalDetails || content.labels?.technicalDetails || 'TECHNICAL DETAILS'}</h3>
                                <p>{project.technicalDetails}</p>
                            </>
                        )}

                        {project.visibility?.designJourney !== false && project.sections && project.sections.length > 0 && (
                            <>
                                <h3 className="text-2xl font-bold text-foreground pt-8">{project.labels?.designJourney || content.labels?.designJourney || 'DESIGN JOURNEY'}</h3>
                                <div className="space-y-8">
                                    {project.sections.filter(s => !s.hidden && s.type !== 'custom-section').map((section, index) => (
                                        <div key={index}>
                                            {section.title && (
                                                <h4 className="text-xl font-semibold text-foreground">{section.title}</h4>
                                            )}
                                            {section.type === 'image' && (section.src || section.videoUrl) && (
                                                <div className="rounded-lg overflow-hidden">
                                                    <MediaDisplay
                                                        src={section.src}
                                                        videoUrl={section.videoUrl}
                                                        alt={section.alt || `Project image ${index + 1}`}
                                                        className="w-full h-auto object-cover"
                                                    />
                                                </div>
                                            )}
                                            {section.type === 'video' && (section.src || section.videoUrl) && (
                                                <div className="rounded-lg overflow-hidden">
                                                    <MediaDisplay
                                                        src={section.src}
                                                        videoUrl={section.videoUrl}
                                                        alt={section.alt || `Project video ${index + 1}`}
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
                                            {section.type === 'marquee' && section.marqueeItems && section.marqueeItems.length > 0 && (
                                                <DetailMarquee
                                                    leftImage={section.marqueeLeftImage || project.heroImage || project.cardImage || ''}
                                                    leftAlt={section.marqueeLeftAlt || project.title}
                                                    items={section.marqueeItems}
                                                />
                                            )}
                                            {section.type === 'accordion-projects' && section.accordionItems && section.accordionItems.length > 0 && (
                                                <AccordionProjects items={section.accordionItems} title={section.title || project.labels?.designJourney || content?.labels?.designJourney} />
                                            )}
                                            {section.type === 'external-links' && section.externalLinks && (
                                                <div className="space-y-3">
                                                    <h4 className="text-xl font-semibold text-foreground">{section.title || project.labels?.externalResources || content.labels?.externalResources || 'External Resources'}</h4>
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
                                            {section.type === 'custom' && section.customContent && (
                                                <div dangerouslySetInnerHTML={{ __html: section.customContent }} />
                                            )}
                                            {section.type === 'marquee-inline' && (!section.position || section.position === 'journey') && section.marqueeInlineItems && section.marqueeInlineItems.length > 0 && (
                                                <div className="my-8">
                                                    <DetailMarquee
                                                        leftImage={section.marqueeInlineLeftImage || project.heroImage || project.cardImage || ''}
                                                        leftAlt={project.title}
                                                        items={section.marqueeInlineItems}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Custom Sections */}
                        {project.sections && project.sections.filter(s => s.type === 'custom-section' && !s.hidden).map((section, index) => (
                            <div key={`custom-section-${index}`} className="pt-8">
                                {section.title && (
                                    <h3 className="text-2xl font-bold text-foreground mb-6">{section.title}</h3>
                                )}
                                {section.customBlocks && section.customBlocks.map((block, blockIndex) => (
                                    <CustomSectionRenderer
                                        key={`custom-block-${index}-${blockIndex}`}
                                        section={block}
                                        projectTitle={project.title}
                                        projectHeroImage={project.heroImage}
                                        projectCardImage={project.cardImage}
                                    />
                                ))}
                            </div>
                        ))}
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

export default ProjectDetail;
