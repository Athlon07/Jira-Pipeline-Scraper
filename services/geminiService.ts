import { GoogleGenAI } from '@google/genai';

const PROMPT = `
Analyze the following Jira issue data, provided in JSONL format.
Provide an overall analysis of the entire dataset. Identify common themes, potential problem areas,
and the distribution of issue types (e.g., bugs vs. features) based on the provided text.
Structure your response with clear headings and bullet points. Do not use Markdown syntax.

Here is the data:
---
`;

export const analyzeDataWithGemini = async (jsonData: string): Promise<string> => {
  // The API key is automatically available as process.env.API_KEY in the execution environment.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: PROMPT + jsonData,
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error) {
        return `Error analyzing data: ${error.message}`;
    }
    return `An unknown error occurred during analysis.`;
  }
};