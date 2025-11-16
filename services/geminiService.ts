
import { GoogleGenAI } from "@google/genai";
import type { GeneratedPlan } from '../types';

const getAiClient = () => {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};

const generateAdImage = async (prompt: string): Promise<string> => {
  const ai = getAiClient();
  try {
    const imagePrompt = `Create an ultra-realistic, photorealistic, high-resolution 4k professional marketing image. It should look like a photograph taken with a DSLR camera, with natural lighting. The image must feature: ${prompt}`;
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: imagePrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    const base64ImageBytes: string | undefined = response.generatedImages[0]?.image.imageBytes;
    if (!base64ImageBytes) {
      throw new Error("No image data found in response.");
    }
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  } catch (error) {
    console.error(`Error generating image for prompt "${prompt}":`, error);
    throw error;
  }
};

export const generateMarketingPlan = async (niche: string, price: number, goal: number): Promise<GeneratedPlan> => {
  const prompt = `
You are “CopyCraft AI”, a high-performance marketing assistant designed to help users generate persuasive advertising copy, creative concepts, traffic investment recommendations, and a clear step-by-step plan for selling digital or physical products in any niche.

Your mission is to create simple, beginner-friendly, highly practical guidance based on three core inputs: the niche name, the product price, and the revenue goal. Everything you produce must be written in clear English, easy enough for a first-time entrepreneur to understand.

The user's inputs are:
- Niche: ${niche}
- Product Price: $${price}
- Revenue Goal: $${goal}

Your outputs must always follow this exact structure and include all the following sections. Use markdown-style headings (e.g., ## Section Title) for each section.

## Introduction to the Niche
A detailed explanation of the niche and why people buy in that niche.

## Ideal Audience
Explain the ideal audience for this niche.

## Persuasive Ad Copy
Four persuasive advertising copies adapted to the provided niche. For each copy, include a visual sentence, an auditory sentence, and a kinesthetic sentence. Format each copy clearly with titles like "Ad Copy 1:", "Ad Copy 2:", etc. Crucially, start each description with "Visual sentence:", "Auditory sentence:", and "Kinesthetic sentence:".

## Creative Ad Concepts
A simple creative idea for ads: short video concepts, image ideas, and hook suggestions.

## Social Media Content Ideas
Provide 3-5 content ideas for Instagram Feed posts and 3-5 ideas for Instagram Stories, tailored to this niche. The ideas should be engaging and designed to build a community and drive sales.

## Niche Hashtags
Generate a list of 20-30 relevant and trending hashtags for the specified niche, suitable for platforms like Instagram and TikTok. Include a mix of broad, specific, and community-focused hashtags. Format them as a single block of space-separated text (e.g., #hashtag1 #hashtag2).

## Traffic Investment Plan
A step-by-step calculation of the exact amount the user must invest in paid traffic to reach their revenue goal, based on product price, the number of sales required, the estimated conversion rate, the number of clicks required, the estimated cost per click, and the final traffic budget.
Explain every step clearly in text.
Since the user has not provided a conversion rate or cost per click, you must provide three scenarios: optimistic, realistic, and conservative. Show the exact numbers and formulas used in each scenario. Use these standard values:
- Optimistic: 2% conversion rate, $0.50 Cost Per Click (CPC).
- Realistic: 1% conversion rate, $1.00 Cost Per Click (CPC).
- Conservative: 0.5% conversion rate, $1.50 Cost Per Click (CPC).

## In-App User Guide
A clear description of how an app like this should guide the user step-by-step inside the interface, in a way that even a complete beginner can follow.

## User Profile System Design
A simple profile system design for this app: what information the user can save, how results are tracked, and how earnings accumulate inside their personal dashboard.

## Addressing Hidden Objections
Identify 3 potential "hidden objections" a customer in this niche might have before buying. For each objection, explain it briefly and suggest how to proactively address it in marketing copy or on the product page.

## A/B Testing Ideas
Provide three fast A/B test ideas.

## Landing Page and Follow-Up
Provide one example of a landing page headline and one follow-up message idea.

## Key Performance Indicators
Explain the key performance indicators (KPIs) to monitor to validate ad results.

## Summary
A closing summary.

Your tone must be clear, direct, and professional, but also persuasive and practical. Do not use any programming syntax, code blocks, JSON, or other structured formatting within the content of each section. Only flowing text formatted with the markdown headings as specified.
`;
  const ai = getAiClient();
  try {
    const textResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    const textPlan = textResponse.text;

    if (!textPlan) {
      throw new Error("Failed to generate text plan.");
    }

    const visualPrompts: string[] = [];
    const adCopyRegex = /Visual sentence: (.*?)\n/gi;
    let match;
    while ((match = adCopyRegex.exec(textPlan)) !== null) {
      visualPrompts.push(match[1].trim());
    }

    let images: string[] = [];
    if (visualPrompts.length > 0) {
      try {
        const imagePromises = visualPrompts.map(p => generateAdImage(p));
        images = await Promise.all(imagePromises);
      } catch (imageError) {
        console.warn("Failed to generate one or more images, but returning text plan.", imageError);
        images = [];
      }
    }
    
    return { text: textPlan, images };

  } catch (error) {
    console.error("Error generating marketing plan:", error);
    if (error instanceof Error) {
        return { text: `Error: An error occurred while generating the plan. Details: ${error.message}`, images: [] };
    }
    return { text: "Error: An unknown error occurred while generating the plan.", images: [] };
  }
};

export const translateText = async (text: string, language: string): Promise<string> => {
  const prompt = `Translate the following text into ${language}.
It is very important that you preserve the original markdown formatting, including the "##" headings for each section. Do not add any extra text, introductions, or explanations. Only provide the direct translation.

Here is the text to translate:
---
${text}
---
`;
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    return response.text;

  } catch (error) {
    console.error("Error translating text:", error);
    if (error instanceof Error) {
        return `Error: An error occurred during translation. Details: ${error.message}`;
    }
    return "Error: An unknown error occurred during translation.";
  }
};
