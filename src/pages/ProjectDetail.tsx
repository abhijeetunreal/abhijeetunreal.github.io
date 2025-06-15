
import { useParams, Link } from 'react-router-dom';
import { projects } from '@/data/projects';
import Header from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import NotFound from './NotFound';
import { slugify } from '@/lib/utils';

const ProjectDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const project = projects.find(p => slugify(p.title) === slug);

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
                        <p>{project.description}</p>
                        
                        <div className="aspect-video bg-muted rounded-lg my-12 flex items-center justify-center">
                            <p className="text-muted-foreground">[Project Image/Visual]</p>
                        </div>

                        <h3 className="text-2xl font-bold text-foreground pt-8">[DESIGN PROCESS]</h3>
                        <p>A detailed walkthrough of the design process would be here. Discussing user research, ideation, prototyping, and user testing. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.</p>
                        
                        <div className="aspect-video bg-muted rounded-lg my-12 flex items-center justify-center">
                            <p className="text-muted-foreground">[Another Project Image/Visual]</p>
                        </div>

                        <h3 className="text-2xl font-bold text-foreground pt-8">[TECHNICAL DETAILS]</h3>
                        <p>An explanation of the technology stack and implementation details. For example, discussing the use of WebGL for generative visuals in Project Alpha. Cras id urna. Morbi id metus. Praesent nec nisl a purus blandit viverra.</p>
                    </div>
                </div>
            </main>
             <footer id="contact" className="container mx-auto p-4 border-t-2 border-border text-center">
                <div className="flex justify-center gap-6 font-bold text-sm">
                    <a href="#" className="hover:text-primary transition-colors">[EMAIL]</a>
                    <a href="#" className="hover:text-primary transition-colors">[LINKEDIN]</a>
                    <a href="#" className="hover:text-primary transition-colors">[GITHUB]</a>
                </div>
            </footer>
        </div>
    );
};

export default ProjectDetail;
