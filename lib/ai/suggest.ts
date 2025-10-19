/**
 * AI-assisted mushroom identification
 * Pluggable provider architecture (OpenAI | Local)
 */

export interface IdentificationCandidate {
  label: string;
  speciesId?: string;
  confidence: number;
  rationale: string;
}

export interface AIProvider {
  suggest(imageUrl: string): Promise<IdentificationCandidate[]>;
}

/**
 * OpenAI Vision-based identification
 */
class OpenAIProvider implements AIProvider {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async suggest(imageUrl: string): Promise<IdentificationCandidate[]> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are an expert mycologist assistant helping identify mushrooms in Ireland. 
              Provide up to 3 possible identifications with confidence levels and reasoning based on visible traits.
              Focus on: cap color/shape, gill type, stem characteristics, habitat context if visible.
              IMPORTANT: You are assistive, not authoritative. Always express uncertainty appropriately.
              Format your response as JSON array with: label (scientific name), confidence (0-1), rationale (key traits).`,
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Please identify this mushroom and provide up to 3 possibilities:',
                },
                {
                  type: 'image_url',
                  image_url: { url: imageUrl },
                },
              ],
            },
          ],
          max_tokens: 500,
          temperature: 0.3,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }
      
      const data = await response.json();
      const content = data.choices[0]?.message?.content || '[]';
      
      // Parse JSON response
      try {
        const candidates = JSON.parse(content);
        return candidates.slice(0, 3); // Max 3 candidates
      } catch {
        // Fallback if not JSON
        return [
          {
            label: 'Unknown',
            confidence: 0,
            rationale: 'Unable to parse AI response. Please try again or identify manually.',
          },
        ];
      }
    } catch (error) {
      console.error('AI identification error:', error);
      return [
        {
          label: 'Error',
          confidence: 0,
          rationale: 'AI identification service unavailable. Please identify manually.',
        },
      ];
    }
  }
}

/**
 * Local/stub provider for development or offline mode
 */
class LocalProvider implements AIProvider {
  async suggest(imageUrl: string): Promise<IdentificationCandidate[]> {
    // Stub implementation for development
    // In production, this could use a local ONNX model or CLIP embeddings
    return [
      {
        label: 'Agaricus campestris',
        confidence: 0.65,
        rationale: 'White cap, pink/brown gills, grassland habitat (stub identification)',
      },
      {
        label: 'Agaricus bisporus',
        confidence: 0.25,
        rationale: 'Similar features but typically cultivated (stub identification)',
      },
    ];
  }
}

/**
 * Factory function to get AI provider
 */
export function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER || 'OPENAI';
  
  if (provider === 'OPENAI') {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('OPENAI_API_KEY not set, falling back to local provider');
      return new LocalProvider();
    }
    return new OpenAIProvider(apiKey);
  }
  
  return new LocalProvider();
}

/**
 * Main suggestion function with disclaimer
 */
export async function suggestIdentification(
  imageUrl: string
): Promise<{
  candidates: IdentificationCandidate[];
  disclaimer: string;
}> {
  const provider = getAIProvider();
  const candidates = await provider.suggest(imageUrl);
  
  return {
    candidates,
    disclaimer:
      'AI suggestions are assistive only. Community consensus and expert review determine final identification. Never consume mushrooms based solely on AI identification.',
  };
}

