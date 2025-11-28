/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI } from "@google/genai";

// Using gemini-3-pro-image-preview for high quality image generation
const GEMINI_MODEL = 'gemini-3-pro-image-preview';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateProPhoto(prompt: string, category: string, fileBase64?: string, mimeType?: string): Promise<string> {
  const parts: any[] = [];
  
  // Specific instruction based on category
  const categoryContext = {
    'product': 'commercial product photography, studio lighting, clean background, 4k advertising quality',
    'portrait': 'professional headshot or fashion portrait, flattering lighting, bokeh, high-end magazine style',
    'interior': 'architectural digest style, wide angle, perfect exposure, interior design photography',
    'food': 'gourmet food photography, macro details, appetizing lighting, restaurant menu quality',
    'fashion': 'high fashion editorial, runway style, dramatic lighting, vogue aesthetic',
    'landscape': 'national geographic style, cinematic composition, golden hour, high dynamic range'
  }[category.toLowerCase()] || 'professional photography';

  // Prompt engineering for photorealism
  const basePrompt = fileBase64 
    ? `Analyze the input image carefully. It is a reference photo. \n\nTASK: Transform this raw input into a professional ${category} photoshoot.\nSTYLE: ${categoryContext}.\n\nINSTRUCTIONS:\n- Keep the main subject/object from the original image but significantly upgrade the visual quality.\n- Apply professional ${category} lighting techniques.\n- Place the subject in a context appropriate for ${category} photography.\n- Ensure textures are hyper-realistic and details are sharp.` 
    : `Generate a high-quality, professional ${category} photograph. Style: ${categoryContext}.`;

  const finalPrompt = prompt ? `${basePrompt} \nAdditional Details from user: ${prompt}` : basePrompt;

  parts.push({ text: finalPrompt });

  if (fileBase64 && mimeType) {
    parts.push({
      inlineData: {
        data: fileBase64,
        mimeType: mimeType,
      },
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: parts
      },
      config: {
        imageConfig: {
            aspectRatio: "4:3",
            imageSize: "1K"
        }
      },
    });

    // Extract the image from the response
    if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
}