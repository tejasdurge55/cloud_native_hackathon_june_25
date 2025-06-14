import { GoogleGenAI, Modality } from "@google/genai";
import fs from "fs/promises";
import path from "path";

/**
 * Generate an image using Gemini (Flash Image Generation) with both input image + prompt.
 * @param imagePath – Path to the source image file
 * @param prompt – Text prompt guiding the generation/edit
 * @returns Blob URL representing the generated image
 */
export async function generateImageFromImageAndTextBackend(
  imagePath: string,
  prompt: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");
  const ai = new GoogleGenAI({ apiKey });

  // Read and encode image file
  const buf = await fs.readFile(imagePath);
  const base64 = buf.toString("base64");
  const mimeType = getMimeType(imagePath);

  // Request multimodal generation
  const resp = await ai.models.generateContent({
    model: "gemini-2.0-flash-preview-image-generation",
    contents: [
      { text: prompt },
      { inlineData: { data: base64, mimeType } }
    ],
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });

  if (!resp.candidates?.[0]?.content?.parts) {
    throw new Error("Invalid response format from Gemini API");
  }
  const parts = resp.candidates[0].content.parts;
  const imgPart = parts.find(p => p.inlineData);
  if (!imgPart?.inlineData) throw new Error("No image returned");

  if (!imgPart.inlineData.data) throw new Error("Image data is empty");
  const imgBuf = Buffer.from(imgPart.inlineData.data, "base64");
  const blob = new Blob([imgBuf], { type: mimeType });
  return URL.createObjectURL(blob);
}

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  throw new Error(`Unsupported image type: ${ext}`);
}
