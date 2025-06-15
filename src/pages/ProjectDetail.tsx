
import { useParams, Link } from 'react-router-dom';
import content from '@/data/content.json';
import Header from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import NotFound from './NotFound';
import { slugify } from '@/lib/utils';

const ProjectDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const project = content.projects.find(p => slugify(p.title) === slug);

    if (!project) {
        return <NotFound />;
    }

    return (
        <div className="text-foreground min-h-screen font-mono">
            <Header />
            <main className="container mx-auto px-4 pt-24 md:pt-32 pb-16">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <Link to="/">
                             <Button variant="ghost" className="mb-8 px-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to all projects
                            </Button>
                        </Link>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">{project.title}</h1>
                        <div className="flex flex-wrap gap-2 mb-8">
                            {project.tags.map(tag => (
                                <Badge key={tag} variant="secondary">{tag}</Badge>
                            ))}
                        </div>
                    </div>
    
                    <div className="space-y-6 text-lg text-muted-foreground">
                        <p>{project.fullDescription}</p>
                        
                        <div className="aspect-video bg-muted rounded-lg my-12 flex items-center justify-center">
                            <p className="text-muted-foreground">[Project Image/Visual]</p>
                        </div>

                        <h3 className="text-2xl font-bold text-foreground pt-8">[DESIGN PROCESS]</h3>
                        <p>{project.designProcess}</p>
                        
                        <div className="aspect-video bg-muted rounded-lg my-12 flex items-center justify-center">
                            <p className="text-muted-foreground">[Another Project Image/Visual]</p>
                        </div>

                        <h3 className="text-2xl font-bold text-foreground pt-8">[TECHNICAL DETAILS]</h3>
                        <p>{project.technicalDetails}</p>
                    </div>
                </div>
            </main>
             <footer id="contact" className="container mx-auto p-4 border-t-2 border-border text-center">
                <div className="flex justify-center gap-6 font-bold text-sm">
                    {content.contactLinks.map(link => (
                        <a href={link.href} key={link.label} className="hover:text-primary transition-colors">{link.label}</a>
                    ))}
                </div>
            </footer>
        </div>
    );
};

export default ProjectDetail;
