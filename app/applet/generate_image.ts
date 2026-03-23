import { GoogleGenAI } from "@google/genai";
import * as fs from 'fs';
import * as path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generate() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: [
          {
            text: 'A flat vector-style UI placeholder illustration for a "scenic spot" or "tourist attraction". The color palette is strictly monochromatic using shades of lavender and purple. The central element is a stylized, simple geometric illustration of a mountain and a traditional Chinese pavilion in dark purple. The background is a light lavender square with rounded corners, featuring subtle, faint map contour lines and a few small sparkle icons. Clean, minimalist, modern UI asset style, matching the aesthetic of a flat icon design.',
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64Data = part.inlineData.data;
        const buffer = Buffer.from(base64Data, 'base64');
        const dir = path.join(process.cwd(), 'public', '图片');
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(path.join(dir, 'scenic_default.png'), buffer);
        console.log('Image generated and saved to /public/图片/scenic_default.png');
        return;
      }
    }
    console.log('No image found in response');
  } catch (error) {
    console.error('Error generating image:', error);
  }
}

generate();
