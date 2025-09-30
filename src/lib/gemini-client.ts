const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Check if API key is available
const isApiKeyAvailable = () => {
  return !!API_KEY;
};
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Test function to verify API key and connection
export async function testGeminiConnection(): Promise<boolean> {
  try {
    if (!isApiKeyAvailable()) {
      throw new Error('VITE_GEMINI_API_KEY not configured - please set up your Gemini API key');
    }
    
    const testPrompt = "Hello, this is a test message. Please respond with 'Connection successful' if you can read this.";
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': API_KEY as string,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: testPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 50,
        }
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('API quota exceeded (429)');
      }
      return false;
    }

    const data = await response.json();
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
}

export async function generateChatResponse(prompt: string): Promise<string> {
  try {
    if (!isApiKeyAvailable()) {
      throw new Error('VITE_GEMINI_API_KEY not configured - please set up your Gemini API key');
    }
    
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.9,
        topK: 50,
        topP: 0.98,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };



    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': API_KEY as string,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
      const text = data.candidates[0].content.parts[0].text;
      return text || 'No response generated';
    } else if (data.promptFeedback && data.promptFeedback.blockReason) {
      throw new Error(`Content blocked: ${data.promptFeedback.blockReason}`);
    } else {
      return 'Unable to generate response at this time.';
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
}
