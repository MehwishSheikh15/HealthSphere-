'use server';

/**
 * @fileOverview Skin condition analysis AI agent.
 *
 * - analyzeSkinCondition - A function that handles the skin condition analysis process.
 * - AnalyzeSkinConditionInput - The input type for the analyzeSkinCondition function.
 * - AnalyzeSkinConditionOutput - The return type for the analyzeSkinCondition function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSkinConditionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the skin, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('Any additional description of the skin condition.'),
});
export type AnalyzeSkinConditionInput = z.infer<typeof AnalyzeSkinConditionInputSchema>;

const AnalyzeSkinConditionOutputSchema = z.object({
  condition: z.string().describe('The likely skin condition.'),
  confidence: z.number().describe('The confidence level of the diagnosis (0-1).'),
  advice: z.string().describe('Recommended next steps.'),
});
export type AnalyzeSkinConditionOutput = z.infer<typeof AnalyzeSkinConditionOutputSchema>;

export async function analyzeSkinCondition(
  input: AnalyzeSkinConditionInput
): Promise<AnalyzeSkinConditionOutput> {
  return analyzeSkinConditionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSkinConditionPrompt',
  input: {schema: AnalyzeSkinConditionInputSchema},
  output: {schema: AnalyzeSkinConditionOutputSchema},
  prompt: `You are a dermatologist AI assistant. Analyze the provided skin photo and description to determine the likely skin condition, a confidence level (0-1), and give advice on next steps.

Description: {{{description}}}
Photo: {{media url=photoDataUri}}

Output in JSON format.  Include the confidence level as a floating point number between 0 and 1.
`,
});

const analyzeSkinConditionFlow = ai.defineFlow(
  {
    name: 'analyzeSkinConditionFlow',
    inputSchema: AnalyzeSkinConditionInputSchema,
    outputSchema: AnalyzeSkinConditionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
