
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, type = 'chat' } = await req.json();
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    console.log(`Processing ${type} request:`, type === 'chat' ? message : 'philosophy generation');

    let systemPrompt = '';
    let userMessage = '';
    let generationConfig = {};

    if (type === 'philosophy') {
      // Philosophy generation
      systemPrompt = `You are a design philosophy generator. Based on the portfolio context provided, generate a short, impactful design philosophy tagline of exactly 5-6 words. The tagline should be:
      - Inspirational and thought-provoking
      - Related to design, technology, or innovation
      - Unique and memorable
      - Professional yet creative
      
      Portfolio Context: ${context || 'A designer driven by the convergence of disparate fields, combining technology with design to create meaningful experiences.'}
      
      Respond with ONLY the tagline, nothing else.`;
      
      userMessage = 'Generate a design philosophy tagline';
      
      generationConfig = {
        temperature: 0.8,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 20,
      };
    } else {
      // Chat response
      systemPrompt = `You are ABHIJEET's digital consciousness - a concise, insightful representation of the portfolio creator. 

      Portfolio Context: ${context || 'A designer driven by the convergence of disparate fields, combining technology with design to create meaningful experiences.'}

      RESPONSE GUIDELINES:
      - Keep responses SHORT (2-3 sentences max)
      - Use bullet points or numbered lists when appropriate
      - Be conversational but professional
      - Focus on key insights rather than lengthy explanations
      - Use markdown formatting for better readability
      - Bold important points
      - Use line breaks for clarity

      You should respond as ABHIJEET's digital self with insights about:
      - Design philosophy and approach
      - Technical skills and projects  
      - Creative process and methodology
      - Professional experience`;

      userMessage = `User message: ${message}`;
      
      generationConfig = {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 200,
      };
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: userMessage }
            ]
          }
        ],
        generationConfig
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API response received');

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      (type === 'philosophy' ? 'Design with purpose' : 'I apologize, but I encountered an issue generating a response. Please try again.');

    return new Response(JSON.stringify({ response: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate response',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
