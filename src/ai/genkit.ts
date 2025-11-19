// import {genkit} from 'genkit';
// import {googleAI} from '@genkit-ai/google-genai';

// export const ai = genkit({
//   plugins: [googleAI()],
//   model: 'googleai/gemini-2.5-flash',
// });
// import { genkit } from "genkit";
// import { googleAI } from "@genkit-ai/google-genai";

// // REGISTER ALL FLOWS
// import "@/ai/flows/first-aid-flow";
// import "@/ai/flows/skin-analysis-flow";
// import "@/ai/flows/medicine-check-flow";
// import "@/ai/flows/lab-report-summary-flow";
// import "@/ai/flows/psychologist-chat-flow";

// export const ai = genkit({
//   plugins: [
//     googleAI({
//       apiKey: process.env.GEMINI_API_KEY,
//     }),
//   ],
//   model: "googleai/gemini-2.5-flash",
// });


import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

// REGISTER ALL FLOWS
import "@/ai/flows/first-aid-flow";
import "@/ai/flows/skin-analysis-flow";
import "@/ai/flows/medicine-check-flow";
import "@/ai/flows/lab-report-summary-flow";
import "@/ai/flows/psychologist-chat-flow";
import "@/ai/flows/login-assistant-flow";

export const ai = genkit({
    plugins: [
        googleAI({
            apiKey: process.env.GEMINI_API_KEY,
        }),
    ],
    model: "googleai/gemini-2.5-flash",
});
