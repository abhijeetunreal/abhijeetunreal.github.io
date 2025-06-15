
import React from 'react';

type ProjectCardProps = {
  title: string;
  description: string;
  tags: string[];
};

const ProjectCard = ({ title, description, tags }: ProjectCardProps) => {
  return (
    <div className="border-2 border-border p-6 flex flex-col gap-4 group hover:border-primary transition-colors animate-in fade-in-0 duration-300">
      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground flex-grow">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="text-xs font-bold border border-accent px-2 py-1">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProjectCard;
