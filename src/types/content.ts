
export interface NavLink {
    label: string;
    href: string;
}

export type ProjectSectionMarqueeItem = string | { image: string };

export interface ProjectAccordionItem {
    title: string;
    year?: string;
    image?: string;
    description?: string;
    linkHref?: string;
    linkLabel?: string;
}

export interface ProjectSection {
    type: 'image' | 'video' | 'paragraph' | 'youtube-video' | 'external-links' | 'marquee' | 'marquee-inline' | 'accordion-projects' | 'custom';
    position?: 'top' | 'after-description' | 'between-design-and-technical' | 'journey';
    // Generic, per-section controls
    title?: string; // Optional visible title for this section (overrides default headings where applicable)
    hidden?: boolean; // If true, this section will not render
    // Common content fields
    src?: string;
    alt?: string;
    content?: string;
    youtubeUrl?: string;
    videoUrl?: string; // MP4 video URL
    externalLinks?: NavLink[];
    // Opt-in marquee data: when present and type === 'marquee' we render DetailMarquee
    marqueeLeftImage?: string;
    marqueeLeftAlt?: string;
    marqueeItems?: ProjectSectionMarqueeItem[];
    // For inline marquee, allows optional left image override (if omitted, no left image used)
    marqueeInlineLeftImage?: string;
    marqueeInlineItems?: ProjectSectionMarqueeItem[];
    // Optional accordion list of related/extra projects
    accordionItems?: ProjectAccordionItem[];
    // For custom section blocks
    customContent?: string; // Optional HTML string for fully custom content
}

export interface Project {
    title: string;
    description: string;
    tags: string[];
    cardImage?: string;
    heroImage?: string;
    designProcessImage?: string;
    cardVideo?: string; // MP4 video URL for card
    heroVideo?: string; // MP4 video URL for hero
    fullDescription: string;
    designProcess: string;
    technicalDetails: string;
    sections?: ProjectSection[];
    labels?: {
        designProcess?: string;
        technicalDetails?: string;
        designJourney?: string;
        researchApproach?: string;
        keyFindings?: string;
        articleContent?: string;
        externalResources?: string;
    };
    visibility?: {
        // Project detail visibility toggles (default true)
        designProcess?: boolean;
        technicalDetails?: boolean;
        designJourney?: boolean;
        // Blog post visibility toggles (also default true when relevant)
        researchApproach?: boolean;
        keyFindings?: boolean;
        articleContent?: boolean;
    };
}

export interface Philosophy {
    statement: string;
}

export interface About {
    title: string;
    paragraph1: string;
    paragraph2: string;
    philosophies: Philosophy[];
}

export interface AiPhilosophy {
    context: string;
    promptTemplate: string;
}

export interface Company {
    name: string;
    logo: string;
    darkLogo?: string; // Optional dark mode logo
}

export interface Experience {
    role: string;
    company: string;
    companyLogo?: string;
    companyDarkLogo?: string;
    duration: string;
    description: string;
}

export interface Education {
    degree: string;
    institution: string;
    year: string;
    description: string;
}

export interface Skills {
    design: string[];
    technology: string[];
    tools: string[];
}

export interface Award {
    title: string;
    organization: string;
    description: string;
}

export interface AboutPage {
    title: string;
    subtitle: string;
    bio: {
        intro: string;
        mission: string;
        approach: string;
    };
    education: Education[];
    experience: Experience[];
    skills: Skills;
    interests: string[];
    awards: Award[];
}

export interface ContentData {
    name: string;
    navLinks: NavLink[];
    contactLinks: NavLink[];
    hero: {
        title: string;
    };
    labels?: {
        designProcess?: string;
        technicalDetails?: string;
        designJourney?: string;
        researchApproach?: string;
        keyFindings?: string;
        articleContent?: string;
        externalResources?: string;
    };
    environment?: {
        customEnvLink?: string;
    };
    aiChat: {
        greeting: string;
        promptPlaceholder: string;
    };
    work: {
        title: string;
        subtitle: string;
    };
    about: About;
    aboutPage: AboutPage;
    workedWith: {
        title: string;
        companies: Company[];
    };
    projects: Project[];
    experimentalProjects: Project[];
    blogPosts: Project[];
    aiPhilosophy: AiPhilosophy;
}
