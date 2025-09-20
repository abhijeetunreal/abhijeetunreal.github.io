import React from 'react';
import MediaDisplay from '@/components/ui/MediaDisplay';
import DetailMarquee from '@/components/DetailMarquee';
import AccordionProjects from '@/components/AccordionProjects';
import { CustomSectionBlock, ProjectSectionMarqueeItem, ProjectAccordionItem, NavLink } from '@/types/content';

interface CustomSectionRendererProps {
    section: CustomSectionBlock;
    projectTitle: string;
    projectHeroImage?: string;
    projectCardImage?: string;
}

const CustomSectionRenderer: React.FC<CustomSectionRendererProps> = ({
    section,
    projectTitle,
    projectHeroImage,
    projectCardImage
}) => {
    const renderBlock = () => {
        switch (section.type) {
            case 'text':
                return (
                    <div className="space-y-3">
                        {section.title && (
                            <h5 className="text-lg font-semibold text-foreground">{section.title}</h5>
                        )}
                        {section.content && (
                            <p className="text-foreground leading-relaxed">
                                {section.content}
                            </p>
                        )}
                    </div>
                );

            case 'paragraph':
                return (
                    <div className="space-y-3">
                        {section.title && (
                            <h5 className="text-lg font-semibold text-foreground">{section.title}</h5>
                        )}
                        {section.content && (
                            <p className="text-foreground leading-relaxed">
                                {section.content}
                            </p>
                        )}
                    </div>
                );

            case 'image':
                return (
                    <div className="space-y-3">
                        {section.title && (
                            <h5 className="text-lg font-semibold text-foreground">{section.title}</h5>
                        )}
                        {section.src && (
                            <div className="rounded-lg overflow-hidden">
                                <MediaDisplay
                                    src={section.src}
                                    alt={section.alt || `${projectTitle} image`}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        )}
                    </div>
                );

            case 'video':
                return (
                    <div className="space-y-3">
                        {section.title && (
                            <h5 className="text-lg font-semibold text-foreground">{section.title}</h5>
                        )}
                        {(section.src || section.videoUrl) && (
                            <div className="rounded-lg overflow-hidden">
                                <MediaDisplay
                                    src={section.src}
                                    videoUrl={section.videoUrl}
                                    alt={section.alt || `${projectTitle} video`}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        )}
                    </div>
                );

            case 'youtube-video':
                return (
                    <div className="space-y-3">
                        {section.title && (
                            <h5 className="text-lg font-semibold text-foreground">{section.title}</h5>
                        )}
                        {section.youtubeUrl && (
                            <div className="rounded-lg overflow-hidden">
                                <iframe
                                    src={section.youtubeUrl.replace('watch?v=', 'embed/')}
                                    title={`${projectTitle} Video`}
                                    className="w-full aspect-video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        )}
                    </div>
                );

            case 'external-links':
                return (
                    <div className="space-y-3">
                        {section.title && (
                            <h5 className="text-lg font-semibold text-foreground">{section.title}</h5>
                        )}
                        {section.externalLinks && section.externalLinks.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {section.externalLinks.map((link, linkIndex) => (
                                    <a
                                        key={linkIndex}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 'marquee':
                return (
                    <div className="space-y-3">
                        {section.title && (
                            <h5 className="text-lg font-semibold text-foreground">{section.title}</h5>
                        )}
                        {section.marqueeItems && section.marqueeItems.length > 0 && (
                            <DetailMarquee
                                leftImage={section.marqueeLeftImage || projectHeroImage || projectCardImage || ''}
                                leftAlt={section.marqueeLeftAlt || projectTitle}
                                items={section.marqueeItems}
                            />
                        )}
                    </div>
                );

            case 'marquee-inline':
                return (
                    <div className="space-y-3">
                        {section.title && (
                            <h5 className="text-lg font-semibold text-foreground">{section.title}</h5>
                        )}
                        {section.marqueeInlineItems && section.marqueeInlineItems.length > 0 && (
                            <DetailMarquee
                                leftImage={section.marqueeInlineLeftImage || projectHeroImage || projectCardImage || ''}
                                leftAlt={projectTitle}
                                items={section.marqueeInlineItems}
                            />
                        )}
                    </div>
                );

            case 'accordion-projects':
                return (
                    <div className="space-y-3">
                        {section.title && (
                            <h5 className="text-lg font-semibold text-foreground">{section.title}</h5>
                        )}
                        {section.accordionItems && section.accordionItems.length > 0 && (
                            <AccordionProjects 
                                items={section.accordionItems} 
                                title={section.title || 'Related Projects'} 
                            />
                        )}
                    </div>
                );

            case 'html':
                return (
                    <div className="space-y-3">
                        {section.title && (
                            <h5 className="text-lg font-semibold text-foreground">{section.title}</h5>
                        )}
                        {section.htmlContent && (
                            <div 
                                className="text-foreground leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: section.htmlContent }}
                            />
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-4">
            {renderBlock()}
        </div>
    );
};

export default CustomSectionRenderer;
