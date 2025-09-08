import React, { useState } from 'react';
import { ProjectAccordionItem } from '@/types/content';

interface AccordionProjectsProps {
    items: ProjectAccordionItem[];
    title?: string;
}

const AccordionProjects: React.FC<AccordionProjectsProps> = ({ items, title }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    if (!items || items.length === 0) return null;

    return (
        <div className="w-full">
            
            <div className="rounded-lg border border-border overflow-hidden">
                {items.map((item, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div key={index} className="project-item border-t first:border-t-0 border-border">
                            <button
                                type="button"
                                className="project-header w-full flex justify-between items-center py-5 px-5 cursor-pointer hover:bg-muted/50 transition-colors duration-300 text-left"
                                onClick={() => setOpenIndex(isOpen ? null : index)}
                                aria-expanded={isOpen}
                                aria-controls={`accordion-content-${index}`}
                            >
                                <span className="text-base md:text-lg">{item.title}</span>
                                <span className="text-muted-foreground text-sm">{item.year}</span>
                            </button>
                            <div
                                id={`accordion-content-${index}`}
                                className={`project-content grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                            >
                                <div className={`overflow-hidden opacity-0 ${isOpen ? 'opacity-100 pt-2 pb-8' : ''} px-5 transition-opacity duration-300 delay-200`}> 
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-auto rounded-lg mb-4"
                                        />
                                    )}
                                    {item.description && (
                                        <p className="text-muted-foreground mb-2">{item.description}</p>
                                    )}
                                    {item.linkHref && (
                                        <a
                                            href={item.linkHref}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            {item.linkLabel || item.linkHref}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AccordionProjects;


