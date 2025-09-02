
export interface NavLink {
    label: string;
    href: string;
}

export type ProjectSectionMarqueeItem = string | { image: string };

export interface ProjectSection {
    type: 'image' | 'paragraph' | 'youtube-video' | 'external-links' | 'marquee' | 'marquee-inline';
    position?: 'top' | 'after-description' | 'between-design-and-technical' | 'journey';
    src?: string;
    alt?: string;
    content?: string;
    youtubeUrl?: string;
    externalLinks?: NavLink[];
    // Opt-in marquee data: when present and type === 'marquee' we render DetailMarquee
    marqueeLeftImage?: string;
    marqueeLeftAlt?: string;
    marqueeItems?: ProjectSectionMarqueeItem[];
    // For inline marquee, allows optional left image override (if omitted, no left image used)
    marqueeInlineLeftImage?: string;
    marqueeInlineItems?: ProjectSectionMarqueeItem[];
}

export interface Project {
    title: string;
    description: string;
    tags: string[];
    cardImage?: string;
    heroImage?: string;
    designProcessImage?: string;
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
