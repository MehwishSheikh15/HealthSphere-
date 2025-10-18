'use server';
/**
 * @fileOverview Summarizes a lab report for patients.
 *
 * - summarizeLabReport - A function that summarizes the lab report.
 * - SummarizeLabReportInput - The input type for the summarizeLabReport function.
 * - SummarizeLabReportOutput - The return type for the summarizeLabReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLabReportInputSchema = z.object({
  labReportDataUri: z
    .string()
    .describe(
      "A lab report, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SummarizeLabReportInput = z.infer<typeof SummarizeLabReportInputSchema>;

const SummarizeLabReportOutputSchema = z.object({
  summary: z.string().describe('A simplified summary of the lab report.'),
});
export type SummarizeLabReportOutput = z.infer<typeof SummarizeLabReportOutputSchema>;

export async function summarizeLabReport(input: SummarizeLabReportInput): Promise<SummarizeLabReportOutput> {
  return summarizeLabReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeLabReportPrompt',
  input: {schema: SummarizeLabReportInputSchema},
  output: {schema: SummarizeLabReportOutputSchema},
  prompt: `You are a medical expert whose job is to explain lab reports to patients in simple terms.

  Please provide a simplified summary of the lab report provided below. Focus on key findings and their potential implications for the patient's health.

  Lab Report: {{media url=labReportDataUri}}`,
});

const summarizeLabReportFlow = ai.defineFlow(
  {
    name: 'summarizeLabReportFlow',
    inputSchema: SummarizeLabReportInputSchema,
    outputSchema: SummarizeLabReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
