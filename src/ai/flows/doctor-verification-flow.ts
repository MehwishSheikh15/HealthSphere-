'use server';

/**
 * @fileOverview Verifies doctor documents using AI to streamline the verification process for admins.
 *
 * - verifyDoctorDocuments - A function that handles the doctor document verification process.
 * - VerifyDoctorDocumentsInput - The input type for the verifyDoctorDocuments function.
 * - VerifyDoctorDocumentsOutput - The return type for the verifyDoctorDocuments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyDoctorDocumentsInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A doctor's license/degree document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  adminInstructions: z
    .string()
    .describe('Any specific instructions from the admin regarding the verification process.'),
});
export type VerifyDoctorDocumentsInput = z.infer<typeof VerifyDoctorDocumentsInputSchema>;

const VerifyDoctorDocumentsOutputSchema = z.object({
  verificationScore: z
    .number()
    .describe(
      'A score (0-100) indicating the likelihood that the document is valid and the doctor is qualified.'
    ),
  summary: z
    .string()
    .describe(
      'A summary of the document verification process, including any issues or concerns.'
    ),
});
export type VerifyDoctorDocumentsOutput = z.infer<typeof VerifyDoctorDocumentsOutputSchema>;

export async function verifyDoctorDocuments(
  input: VerifyDoctorDocumentsInput
): Promise<VerifyDoctorDocumentsOutput> {
  return verifyDoctorDocumentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyDoctorDocumentsPrompt',
  input: {schema: VerifyDoctorDocumentsInputSchema},
  output: {schema: VerifyDoctorDocumentsOutputSchema},
  prompt: `You are an AI assistant that helps verify doctor documents for the HealthSphere network.\n\nYou will receive a document and instructions, and you will output a score (0-100) indicating the likelihood that the document is valid and the doctor is qualified, along with a summary of the verification process, including any issues or concerns.\n\nAdmin Instructions: {{{adminInstructions}}}\n\nDocument: {{media url=documentDataUri}}\n\nOutput in JSON format.`,
});

const verifyDoctorDocumentsFlow = ai.defineFlow(
  {
    name: 'verifyDoctorDocumentsFlow',
    inputSchema: VerifyDoctorDocumentsInputSchema,
    outputSchema: VerifyDoctorDocumentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
