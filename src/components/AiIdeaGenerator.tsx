
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';

type Project = {
  title: string;
  description: string;
  tags: string[];
};

type AiIdeaGeneratorProps = {
    projects: Project[];
}

const getRandomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

const concepts = ["connection", "identity", "sustainability", "future of work", "digital well-being", "learning"];

const AiIdeaGenerator = ({ projects }: AiIdeaGeneratorProps) => {
  const [idea, setIdea] = useState("Click the button to generate a project concept inspired by my work.");
  const [displayedIdea, setDisplayedIdea] = useState(idea);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isTyping) {
      setDisplayedIdea('');
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < idea.length) {
          setDisplayedIdea(prev => prev + idea.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 30);

      return () => {
        clearInterval(typingInterval);
      };
    }
  }, [idea, isTyping]);

  const uniqueTags = useMemo(() => {
    return [...new Set(projects.flatMap(p => p.tags))];
  }, [projects]);

  const generateIdea = () => {
    if (isTyping) return; // Don't generate while typing

    if (uniqueTags.length < 2) {
        const newIdea = "Not enough project tags to generate an idea.";
        setIdea(newIdea);
        setDisplayedIdea(newIdea); // Don't type this message
        return;
    }
    
    let tag1 = getRandomItem(uniqueTags);
    let tag2 = getRandomItem(uniqueTags);
    // Ensure two different tags are picked
    while(tag1 === tag2) {
        tag2 = getRandomItem(uniqueTags);
    }
    
    const concept = getRandomItem(concepts);
    
    const newIdea = `An exploration of ${concept}, combining my experience in ${tag1} and ${tag2}.`;
    setIdea(newIdea);
    setIsTyping(true);
  };

  return (
    <div className="border-2 border-dashed border-border p-6 text-center">
      <h3 className="text-sm uppercase font-bold text-muted-foreground mb-4">[AI Project Idea Generator]</h3>
      <p className="text-lg text-foreground min-h-[4em] mb-6 font-bold">
        {displayedIdea}
        {isTyping && <span className="animate-pulse opacity-75">_</span>}
      </p>
      <Button
        onClick={generateIdea}
        size="lg"
        className="font-bold"
        disabled={isTyping}
      >
        {isTyping ? "[GENERATING...]" : "[ GENERATE NEW CONCEPT ]"}
      </Button>
    </div>
  );
};

export default AiIdeaGenerator;
