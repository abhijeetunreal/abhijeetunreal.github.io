
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { slugify } from '@/lib/utils';

type Project = {
  title: string;
  description: string;
  tags: string[];
};

type ProjectShowcaseProps = {
  projects: Project[];
  tags: string[];
};

const ProjectShowcase = ({ projects, tags }: ProjectShowcaseProps) => {
  const [activeTag, setActiveTag] = useState<string>('All');

  const filteredProjects = useMemo(() => {
    if (activeTag === 'All') {
      return projects;
    }
    return projects.filter(p => p.tags.includes(activeTag));
  }, [activeTag, projects]);

  const allTagsWithAll = ['All', ...tags];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {allTagsWithAll.map(tag => (
          <Button
            key={tag}
            variant={activeTag === tag ? 'default' : 'outline'}
            onClick={() => setActiveTag(tag)}
            className="rounded-full px-4 py-2 text-sm"
          >
            {tag}
          </Button>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project, index) => (
          <Link to={`/project/${slugify(project.title)}`} key={project.title} className="block hover:no-underline group">
            <Card className="h-full flex flex-col animate-fade-in border-accent group-hover:border-primary transition-colors" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-4">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectShowcase;
