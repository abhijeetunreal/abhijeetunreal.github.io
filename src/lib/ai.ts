import { AiPhilosophy } from '@/types/content';

// This file is now deprecated as we use Supabase Edge Functions for AI generation
// Keeping for backward compatibility

export const generatePhilosophy = async (aiPhilosophy: AiPhilosophy): Promise<string> => {
    console.log("Note: This function is deprecated. Use Supabase Edge Function instead.");
    
    // Fallback philosophies for any remaining usage
    const fallbackPhilosophies = [
        "Design with purpose",
        "Innovation through convergence", 
        "Technology meets humanity",
        "Create meaningful experiences",
        "Build bridges, not walls"
    ];
    
    return new Promise(resolve => {
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * fallbackPhilosophies.length);
            resolve(fallbackPhilosophies[randomIndex]);
        }, 1000);
    });
};
