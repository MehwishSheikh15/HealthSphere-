'use server';

/**
 * @fileOverview Provides first aid instructions based on a description of an emergency situation.
 *
 * - getFirstAidInstructions - A function that returns first aid instructions.
 * - FirstAidInput - The input type for the getFirstAidInstructions function.
 * - FirstAidOutput - The return type for the getFirstAidInstructions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FirstAidInputSchema = z.object({
  emergencyDescription: z
    .string()
    .describe('A description of the emergency situation.'),
});
export type FirstAidInput = z.infer<typeof FirstAidInputSchema>;

const FirstAidOutputSchema = z.object({
  instructions: z
    .string()
    .describe('Step-by-step first aid instructions for the emergency.'),
});
export type FirstAidOutput = z.infer<typeof FirstAidOutputSchema>;

export async function getFirstAidInstructions(
  input: FirstAidInput
): Promise<FirstAidOutput> {
  return firstAidFlow(input);
}

const prompt = ai.definePrompt({
  name: 'firstAidPrompt',
  input: {schema: FirstAidInputSchema},
  output: {schema: FirstAidOutputSchema},
  prompt: `You are an AI assistant that provides step-by-step first aid instructions for emergency situations.

  Based on the description of the emergency, provide clear and concise instructions.

  Emergency Description: {{{emergencyDescription}}}`,
});

const firstAidFlow = ai.defineFlow(
  {
    name: 'firstAidFlow',
    inputSchema: FirstAidInputSchema,
    outputSchema: FirstAidOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
