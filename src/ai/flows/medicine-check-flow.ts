'use server';

/**
 * @fileOverview A medicine identification AI agent.
 *
 * - checkMedicine - A function that handles the medicine identification process.
 * - CheckMedicineInput - The input type for the checkMedicine function.
 * - CheckMedicineOutput - The return type for the checkMedicine function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckMedicineInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a medicine, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type CheckMedicineInput = z.infer<typeof CheckMedicineInputSchema>;

const CheckMedicineOutputSchema = z.object({
  identification: z.object({
    isMedicine: z.boolean().describe('Whether or not the input is a medicine.'),
    name: z.string().describe('The name of the identified medicine.'),
    confidence: z.number().describe('The confidence level of the identification.'),
    description: z.string().describe('A description of the medicine.'),
  }),
});
export type CheckMedicineOutput = z.infer<typeof CheckMedicineOutputSchema>;

export async function checkMedicine(input: CheckMedicineInput): Promise<CheckMedicineOutput> {
  return checkMedicineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkMedicinePrompt',
  input: {schema: CheckMedicineInputSchema},
  output: {schema: CheckMedicineOutputSchema},
  prompt: `You are an expert pharmacist specializing in identifying medicines.

You will use this information to identify the medicine, and provide a description of it.

Use the following as the primary source of information about the medicine.

Photo: {{media url=photoDataUri}}`,
});

const checkMedicineFlow = ai.defineFlow(
  {
    name: 'checkMedicineFlow',
    inputSchema: CheckMedicineInputSchema,
    outputSchema: CheckMedicineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
