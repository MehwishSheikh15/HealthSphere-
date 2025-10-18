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
import { checkPmdcRegistry } from '../tools/pmdc-tool';

const VerifyDoctorDocumentsInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A doctor's license/degree document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  licenseNumber: z
    .string()
    .describe("The doctor's medical license number (e.g., PMC-12345)."),
  adminInstructions: z
    .string()
    .describe('Any specific instructions from the admin regarding the verification process.'),
});
export type VerifyDoctorDocumentsInput = z.infer<typeof VerifyDoctorDocumentsInputSchema>;

const VerifyDoctorDocumentsOutputSchema = z.object({
  verificationScore: z
    .number()
    .describe(
      'A score (0-100) indicating the likelihood that the document is valid and the doctor is qualified. A score below 75 is a failure.'
    ),
  summary: z
    .string()
    .describe(
      'A summary of the document verification process, including the result of the PMDC registry check and any issues or concerns with the document.'
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
  tools: [checkPmdcRegistry],
  prompt: `You are an AI assistant that helps verify doctor documents for the HealthSphere network. Your task is to perform a two-step verification:

1.  **Check the PMDC Registry**: Use the 'checkPmdcRegistry' tool with the provided license number ('{{{licenseNumber}}}'). This is the most critical step. If the tool returns 'false', the verification has failed.
2.  **Analyze the Document**: Visually inspect the provided document to ensure it looks legitimate and that the name and license number match the application.

Based on both steps, determine a final verification score and a summary.

-   If the PMDC registry check fails, the score MUST be below 50. State clearly in the summary that the license number was not found in the PMDC registry.
-   If the PMDC registry check succeeds but the document appears forged, tampered with, or does not match, the score should be low (e.g., 50-70).
-   If both the PMDC registry check and the document analysis are successful, the score should be high (e.g., 90-100).

Admin Instructions: {{{adminInstructions}}}

Document: {{media url=documentDataUri}}

Output a valid JSON object.`,
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
