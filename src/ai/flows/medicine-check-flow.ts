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
    ).optional(),
    name: z.string().describe("The name of the medicine.").optional(),
    dosage: z.string().describe("The dosage of the medicine (e.g., '500mg').").optional(),
});
export type CheckMedicineInput = z.infer<typeof CheckMedicineInputSchema>;

const CheckMedicineOutputSchema = z.object({
  identification: z.object({
    isMedicine: z.boolean().describe('Whether or not the input is a medicine.'),
    name: z.string().describe('The name of the identified medicine.'),
    confidence: z.number().describe('The confidence level of the identification.'),
    description: z.string().describe('A description of the medicine.'),
    authenticity: z.string().describe('Information about the medicine\'s authenticity and how to verify it.'),
    usage: z.string().describe('Who should use this medicine and for what conditions.'),
    precautions: z.string().describe('Precautions and potential side effects to be aware of.'),
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
  prompt: `You are an expert pharmacist and drug authentication specialist. Your task is to identify a medicine based on the provided information and give details about its authenticity, usage, and precautions.

You will receive either a photo of the medicine, or its name and dosage, or both. Use all available information to provide the most accurate response.

Use the following as the primary source of information about the medicine.

Name: {{{name}}}
Dosage: {{{dosage}}}
Photo: {{media url=photoDataUri}}

Based on the information, provide the following:
1.  **Identification**: Identify the medicine's name. Assess if the input is a medicine and provide a confidence score.
2.  **Description**: A brief description of the medicine's purpose.
3.  **Authenticity**: Provide information on how a user can verify the authenticity of this medicine (e.g., checking packaging, batch numbers, manufacturer's seals).
4.  **Usage**: Explain who this medicine is for and the typical conditions it treats.
5.  **Precautions**: Detail important precautions, common side effects, and who should avoid this medicine.

Output a valid JSON object.
`,
});

const checkMedicineFlow = ai.defineFlow(
  {
    name: 'checkMedicineFlow',
    inputSchema: CheckMedicineInputSchema,
    outputSchema: CheckMedicineOutputSchema,
  },
  async input => {
    if (!input.photoDataUri && !input.name) {
        throw new Error("Either a photo or a medicine name must be provided.");
    }
    const {output} = await prompt(input);
    return output!;
  }
);
