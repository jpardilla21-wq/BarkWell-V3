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
  rating: "Elite" | "Excellent" | "Good" | "Fair" | "Borderline" | "Poor";
  summary: string;
  good: string[];
  bad: string[];
  neither: string[];
  allergens: string[];
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

    const prompt = `You are a PupSense dog nutrition expert. Analyze dog food ingredients using the PupSense scoring system.
    ${imageData ? "The image shows a pet food label. Extract and analyze the ingredients." : ""}
    ${ingredients ? `Ingredients provided: ${ingredients}` : ""}
    
    SCORING CRITERIA (be strict):
    
    1. FIRST 5 INGREDIENTS (most important - 80% of food comes from these):
       - Named proteins (Chicken, Beef, Salmon, Turkey meal) = +points
       - Vague proteins (meat by-products, animal fat, poultry digest) = -points
    
    2. CARBOHYDRATES:
       - Good: sweet potatoes, oats, brown rice
       - Bad: excessive peas, lentils, or corn (cost-cutting signals)
    
    3. FATS:
       - Good: chicken fat, salmon oil (named sources)
       - Bad: generic "animal fat" 
    
    4. PRESERVATIVES & ADDITIVES:
       - Good: natural preservatives (vitamin E/tocopherols)
       - Bad: artificial colors, flavors, chemical preservatives
    
    SCORE RANGES:
    - 90-100 (Elite): Outstanding ingredients, almost no red flags
    - 80-89 (Excellent): High-quality proteins and fats, minor compromises only
    - 70-79 (Good): Solid nutrition but not perfect, acceptable for most dogs
    - 60-69 (Fair): Noticeable fillers or vague ingredients, better options exist
    - 50-59 (Borderline): Too many trade-offs to confidently recommend
    - 0-49 (Poor): Low-quality ingredients or major red flags, best avoided
    
    Respond in JSON format:
    {
      "score": number (0-100),
      "rating": "Elite" | "Excellent" | "Good" | "Fair" | "Borderline" | "Poor",
      "summary": "Brief assessment explaining the score",
      "good": ["beneficial ingredient with reason"],
      "bad": ["concerning ingredient with reason"],
      "neither": ["neutral ingredient"],
      "allergens": ["common dog allergen found"],
      "toxins": ["toxic ingredient if any"],
      "recommendations": [{"name": "Better food option", "reason": "Why recommended", "affiliateLink": "amazon link"}]
    }
    
    Also check for:
    - Toxic ingredients (chocolate, xylitol, onions, grapes, macadamia nuts)
    - Common dog allergens (beef, chicken, dairy, wheat, soy, corn)
    
    Be intentionally strict. Not every food above 50 deserves recommendation. Aim to help dogs get 70+ quality food.`;

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
