
import { AiPhilosophy } from '@/types/content';

const mockPhilosophies = [
    "True innovation whispers, it doesn't shout.",
    "Marry the logical with the lyrical.",
    "Design for the pause, not just the action.",
    "Seek friction; it's where growth happens.",
    "Build bridges between wonder and utility.",
    "An interface should be a silent partner.",
    "Let data tell a story, not just a number.",
    "Create tools that feel like extensions of the mind.",
    "The best technology is indistinguishable from intuition.",
    "Beauty is the highest form of function.",
    "Design with humility, for humanity.",
    "Simplicity is the ultimate sophistication.",
    "Chaos is the crucible of creativity.",
    "Animate with purpose, not for spectacle.",
    "Code is a craft, not just a command."
];

// This is a mock function. In a real application, this would make an API call to an AI service.
export const generatePhilosophy = async (aiPhilosophy: AiPhilosophy): Promise<string> => {
    console.log("Generating philosophy with context:", aiPhilosophy.context);
    console.log("Using prompt template:", aiPhilosophy.promptTemplate);

    return new Promise(resolve => {
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * mockPhilosophies.length);
            resolve(mockPhilosophies[randomIndex]);
        }, 1000); // Simulate network delay
    });
};
