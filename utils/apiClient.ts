import * as FileSystem from "expo-file-system";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export class APIKeyError extends Error {
  constructor(service: string) {
    super(
      `${service} API key not configured. For the best experience, please use the web version of PupSense.`
    );
    this.name = "APIKeyError";
  }
}

export async function analyzePoopWithGemini(
  photoUri: string | null,
  description: string
): Promise<{
  riskLevel: "Low" | "Medium" | "High";
  summary: string;
  tips: string[];
}> {
  try {
    if (!GEMINI_API_KEY) throw new APIKeyError("Gemini");

    let imageData = null;
    if (photoUri) {
      const base64 = await FileSystem.readAsStringAsync(photoUri, {
        encoding: "base64",
      });
      imageData = base64;
    }

    const prompt = `You are a veterinary health AI assistant. Analyze the dog's stool${description ? ` based on this description: "${description}"` : " from the photo"}.
    
    Respond in JSON format with:
    {
      "riskLevel": "Low" | "Medium" | "High",
      "summary": "Brief assessment of the dog's stool health",
      "tips": ["tip1", "tip2", "tip3", "tip4"]
    }
    
    Be thorough but concise. Focus on actionable health advice.`;

    const body: any = {
      contents: [
        {
          parts: [
            ...(imageData
              ? [
                  {
                    inlineData: {
                      mimeType: "image/jpeg",
                      data: imageData,
                    },
                  },
                ]
              : []),
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Gemini API error");
    }

    const content = data.candidates[0].content.parts[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch ? jsonMatch[0] : content);

    return result;
  } catch (error) {
    console.error("Poop analysis error:", error);
    throw error;
  }
}

export async function analyzeIngredientWithGemini(
  photoUri: string | null,
  ingredients: string
): Promise<{
  score: number;
  summary: string;
  good: string[];
  bad: string[];
  toxins: string[];
  recommendations: Array<{ name: string; reason: string; affiliateLink: string }>;
}> {
  try {
    if (!GEMINI_API_KEY) throw new APIKeyError("Gemini");

    let imageData = null;
    if (photoUri) {
      const base64 = await FileSystem.readAsStringAsync(photoUri, {
        encoding: "base64",
      });
      imageData = base64;
    }

    const prompt = `You are a dog nutrition expert. Analyze dog food ingredients for safety and quality.
    ${imageData ? "The image shows a pet food label. Extract and analyze the ingredients." : ""}
    ${ingredients ? `Ingredients provided: ${ingredients}` : ""}
    
    Respond in JSON format with:
    {
      "score": number (0-100),
      "summary": "Overall assessment",
      "good": ["beneficial ingredient 1", "beneficial ingredient 2"],
      "bad": ["concerning ingredient 1"],
      "toxins": ["toxic ingredient if any"],
      "recommendations": [
        {
          "name": "Food name",
          "reason": "Why it's recommended",
          "affiliateLink": "amazon or brand link"
        }
      ]
    }
    
    Focus on dog health. Identify toxic ingredients (chocolate, xylitol, onions, grapes). Score based on ingredient quality.`;

    const body: any = {
      contents: [
        {
          parts: [
            ...(imageData
              ? [
                  {
                    inlineData: {
                      mimeType: "image/jpeg",
                      data: imageData,
                    },
                  },
                ]
              : []),
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Gemini API error");
    }

    const content = data.candidates[0].content.parts[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch ? jsonMatch[0] : content);

    return result;
  } catch (error) {
    console.error("Food analysis error:", error);
    throw error;
  }
}

export async function analyzeBehaviorWithGemini(
  videoUri: string
): Promise<{
  state:
    | "Relaxed"
    | "Happy & Engaged"
    | "Anxious"
    | "Overstimulated"
    | "Defensive"
    | "Possibly in Pain";
  explanation: string;
  observations: {
    tail: string;
    body: string;
    face: string;
    mouth: string;
  };
  tips: string[];
}> {
  try {
    if (!GEMINI_API_KEY) throw new APIKeyError("Gemini");

    const base64 = await FileSystem.readAsStringAsync(videoUri, {
      encoding: "base64",
    });

    const prompt = `Analyze the dog's behavior and emotional state in this video. Assess body language, tail position, ear position, facial expression, and mouth.
    
    Respond in JSON format with:
    {
      "state": "Relaxed" | "Happy & Engaged" | "Anxious" | "Overstimulated" | "Defensive" | "Possibly in Pain",
      "explanation": "Detailed assessment of the dog's emotional state",
      "observations": {
        "tail": "Description of tail position and movement",
        "body": "Description of body posture",
        "face": "Description of facial expression",
        "mouth": "Description of mouth and jaw"
      },
      "tips": ["actionable tip 1", "actionable tip 2", "actionable tip 3", "actionable tip 4"]
    }
    
    Be professional and focus on observable behaviors.`;

    const body: any = {
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: "video/mp4",
                data: base64,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Gemini API error");
    }

    const content = data.candidates[0].content.parts[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch ? jsonMatch[0] : content);

    return result;
  } catch (error) {
    console.error("Behavior analysis error:", error);
    throw error;
  }
}
