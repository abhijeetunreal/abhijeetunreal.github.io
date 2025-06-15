
import React, { useState } from 'react';

const techs = ["VR/AR", "Machine Learning", "IoT", "Blockchain", "Haptic Feedback", "Biometrics", "Voice UI"];
const designs = ["generative art", "data visualization", "inclusive design", "speculative design", "sustainable UX"];
const needs = ["foster empathy", "promote mental wellness", "enhance creativity", "build community", "simplify complexity"];

const getRandomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const AiIdeaGenerator = () => {
  const [idea, setIdea] = useState("Click the button to generate a project concept.");

  const generateIdea = () => {
    const newIdea = `A ${getRandomItem(techs)} project using ${getRandomItem(designs)} to ${getRandomItem(needs)}.`;
    setIdea(newIdea);
  };

  return (
    <div className="border-2 border-dashed border-border p-6 text-center">
      <h3 className="text-sm uppercase font-bold text-muted-foreground mb-4">[AI Project Idea Generator]</h3>
      <p className="text-lg text-foreground min-h-[3em] mb-6">{idea}</p>
      <button
        onClick={generateIdea}
        className="font-bold bg-primary text-primary-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors"
      >
        [ GENERATE ]
      </button>
    </div>
  );
};

export default AiIdeaGenerator;
