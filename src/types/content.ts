
export interface NavLink {
    label: string;
    href: string;
}

export interface ProjectSection {
    type: 'image' | 'paragraph';
    src?: string;
    alt?: string;
    content?: string;
}

export interface Project {
    title: string;
    description: string;
    tags: string[];
    cardImage?: string;
    fullDescription: string;
    designProcess: string;
    technicalDetails: string;
    sections?: ProjectSection[];
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

export interface ContentData {
    name: string;
    navLinks: NavLink[];
    contactLinks: NavLink[];
    hero: {
        title: string;
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
    workedWith: {
        title: string;
        companies: Company[];
    };
    projects: Project[];
    aiPhilosophy: AiPhilosophy;
}
