import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

/**
 * Generates a video using Veo 2 from both image and text prompt.
 * @param imageFile - Input image file (e.g. from <input type="file">)
 * @param prompt - Textual description to guide video generation
 * @returns URL to video blob
 */
export async function generateVideoFromImageAndText(
  imageFile: File,
  prompt: string
): Promise<string> {
  // Convert image to base64
  const buffer = await imageFile.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const base64Image = btoa(String.fromCharCode(...bytes));

  // Send request to generate video
  const operation = await ai.models.generateVideos({
    model: 'veo-2.0-generate-001',
    prompt: prompt,
    image: {
      imageBytes: base64Image,
      mimeType: imageFile.type,
    },
    config: {
      aspectRatio: '16:9',
      personGeneration: 'dont_allow',
    },
  });

  // Poll until the video generation is complete
  let op = operation;
  while (!op.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    op = await ai.operations.getVideosOperation({ operation: op });
  }

  const videoUri = op.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error('No video URI returned');

  // Fetch and return blob URL
  const response = await fetch(`${videoUri}&key=${import.meta.env.VITE_GEMINI_API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
