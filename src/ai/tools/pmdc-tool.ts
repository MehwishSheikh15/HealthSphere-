'use server';

/**
 * @fileOverview A tool that simulates checking the PMDC (Pakistan Medical and Dental Council) registry.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// A list of fake "valid" license numbers for demonstration purposes.
const validLicenses = [
    'PMC-12345',
    'PMC-54321',
    'D-98765'
];

export const checkPmdcRegistry = ai.defineTool(
  {
    name: 'checkPmdcRegistry',
    description: 'Checks if a given medical license number exists in the (simulated) PMDC registry.',
    inputSchema: z.object({
      licenseNumber: z.string().describe('The medical license number to verify.'),
    }),
    outputSchema: z.object({
        isRegistered: z.boolean().describe('True if the license number is found in the registry, false otherwise.'),
        doctorName: z.string().optional().describe("The name of the doctor associated with the license, if found.")
    }),
  },
  async (input) => {
    // In a real application, this would be an external API call.
    // Here, we simulate the check.
    const isRegistered = validLicenses.includes(input.licenseNumber);
    
    if (isRegistered) {
        // Return some mock data for a registered doctor
        return {
            isRegistered: true,
            doctorName: 'Dr. Mock User' // In a real API, this would be the name from the registry
        };
    }

    return {
        isRegistered: false,
    };
  }
);
