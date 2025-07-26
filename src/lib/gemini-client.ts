if (!import.meta.env.VITE_GEMINI_API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY is not set in .env file');
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Test function to verify API key and connection
export async function testGeminiConnection(): Promise<boolean> {
  try {
    console.log('Testing Gemini API connection...');
    const testPrompt = "Hello, this is a test message. Please respond with 'Connection successful' if you can read this.";
    
    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
      })
    });

    if (!response.ok) {
      console.error('Test failed with status:', response.status);
      if (response.status === 429) {
        console.error('API quota exceeded - daily limit reached');
        throw new Error('API quota exceeded (429)');
      }
      return false;
    }

    const data = await response.json();
    console.log('Test successful:', data);
    return true;
  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  }
}

export async function generateChatResponse(prompt: string): Promise<string> {
  try {
    console.log('Making API request to Gemini...');
    console.log('API Key present:', !!API_KEY);
    console.log('Prompt length:', prompt.length);
    
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
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
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

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response data:', data);
    
    if (data.candidates && data.candidates.length > 0) {
      const text = data.candidates[0].content.parts[0].text;
      console.log('Generated text:', text);
      return text || 'No response generated';
    } else if (data.promptFeedback && data.promptFeedback.blockReason) {
      console.error('Content blocked:', data.promptFeedback);
      throw new Error(`Content blocked: ${data.promptFeedback.blockReason}`);
    } else {
      console.error('Unexpected API response structure:', data);
      return 'Unable to generate response at this time.';
    }
  } catch (error) {
    console.error('Error generating chat response:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}
