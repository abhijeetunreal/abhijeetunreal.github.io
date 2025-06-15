
export interface NavLink {
    label: string;
    href: string;
}

export interface Project {
    title: string;
    description: string;
    tags: string[];
    fullDescription: string;
    designProcess: string;
    technicalDetails: string;
}

export interface Philosophy {
    statement: string;
}

export interface ContentData {
    name: string;
    navLinks: NavLink[];
    contactLinks: NavLink[];
    hero: {
        title: string;
    };
    aiChat: {
        greeting: string;
        promptPlaceholder: string;
    };
    work: {
        title: string;
        subtitle: string;
    };
    about: {
        title: string;
        paragraph1: string;
        paragraph2: string;
        philosophies: Philosophy[];
    };
    workedWith: {
        title: string;
        companies: string[];
    };
    projects: Project[];
}
