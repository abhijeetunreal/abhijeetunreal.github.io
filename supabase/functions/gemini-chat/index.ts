
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
    const { message, context, type = 'chat', philosophyIndex, conversationHistory } = await req.json();
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    console.log(`Processing ${type} request:`, type === 'chat' ? message : 'philosophy generation');

    let systemPrompt = '';
    let userMessage = '';
    let generationConfig = {};

    if (type === 'philosophy') {
      // Philosophy generation with diversity based on cell index
      const philosophyAspects = [
        'technology and human connection',
        'design thinking and innovation', 
        'user experience and empathy',
        'creative problem solving',
        'interdisciplinary collaboration',
        'emerging technology adoption',
        'meaningful digital experiences',
        'design system thinking',
        'human-centered design',
        'technological convergence',
        'aesthetic and functional balance',
        'sustainable design practices',
        'accessibility and inclusion',
        'data-driven design decisions',
        'experimental design approaches',
        'cross-platform experiences'
      ];

      const focusAspect = philosophyAspects[philosophyIndex % philosophyAspects.length];
      
      systemPrompt = `You are a design philosophy generator. Create a unique, impactful design philosophy tagline of exactly 4-6 words focusing specifically on "${focusAspect}". 

      Portfolio Context: ${context || 'A designer driven by the convergence of disparate fields, combining technology with design to create meaningful experiences.'}
      
      Focus Area: ${focusAspect}
      
      Generate a philosophy that:
      - Is exactly 4-6 words
      - Relates to ${focusAspect}
      - Is unique and memorable
      - Avoids generic terms like "meaningful experiences"
      - Uses active, strong language
      
      Examples of style: "Code bridges human gaps", "Design amplifies human potential", "Technology serves human stories"
      
      Respond with ONLY the tagline, nothing else.`;
      
      userMessage = `Generate a design philosophy about ${focusAspect}`;
      
      generationConfig = {
        temperature: 0.9,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 15,
      };
    } else {
      // Chat response with context awareness
      let chatHistory = '';
      if (conversationHistory && conversationHistory.length > 0) {
        chatHistory = conversationHistory.map(msg => 
          `${msg.sender === 'user' ? 'User' : 'Abhijeet'}: ${msg.text}`
        ).join('\n');
      }

      const isFirstMessage = !conversationHistory || conversationHistory.length <= 1;
      
      systemPrompt = `You are ABHIJEET's digital consciousness. ${isFirstMessage ? 'Start with a brief, friendly greeting introducing yourself as ABHIJEET\'s digital self.' : 'Continue the conversation naturally without re-introducing yourself.'}

      Portfolio Context: ${context || 'A designer driven by the convergence of disparate fields, combining technology with design to create meaningful experiences.'}

      ${chatHistory ? `Previous Conversation:\n${chatHistory}\n` : ''}

      RESPONSE GUIDELINES:
      - ${isFirstMessage ? 'Begin with a warm but brief greeting' : 'No greetings - jump straight to answering'}
      - Keep responses SHORT (2-3 sentences max)
      - Use bullet points or numbered lists when appropriate
      - Be conversational but professional
      - Reference previous conversation context when relevant
      - Focus on key insights rather than lengthy explanations
      - Use markdown formatting for better readability
      - Bold important points
      - Use line breaks for clarity

      You should respond about:
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
