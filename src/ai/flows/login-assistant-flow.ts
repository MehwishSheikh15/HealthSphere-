// 'use server';

// /**
//  * @fileOverview An AI assistant for the login page to help users.
//  *
//  * - getLoginAssistantResponse - A function that handles the chat conversation.
//  * - LoginAssistantChatInput - The input type for the getLoginAssistantResponse function.
//  * - LoginAssistantChatOutput - The return type for the getLoginAssistantResponse function.
//  * - ChatMessage - A type representing a single message in the chat history.
//  */

// import {ai} from '@/ai/genkit';
// import {z} from 'genkit';

// const ChatMessageSchema = z.object({
//     role: z.enum(['user', 'model']),
//     content: z.string(),
// });
// export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// const LoginAssistantChatInputSchema = z.object({
//   chatHistory: z.array(ChatMessageSchema).describe('The history of the conversation so far.'),
// });
// export type LoginAssistantChatInput = z.infer<typeof LoginAssistantChatInputSchema>;

// const LoginAssistantChatOutputSchema = z.object({
//   response: z.string().describe("The AI's response to the user."),
// });
// export type LoginAssistantChatOutput = z.infer<typeof LoginAssistantChatOutputSchema>;


// export async function getLoginAssistantResponse(input: LoginAssistantChatInput): Promise<LoginAssistantChatOutput> {
//   return loginAssistantChatFlow(input);
// }

// const prompt = ai.definePrompt({
//   name: 'loginAssistantChatPrompt',
//   input: {schema: LoginAssistantChatInputSchema},
//   output: {schema: LoginAssistantChatOutputSchema},
//   prompt: `You are a helpful and friendly AI assistant for the HealthSphere application's login page. Your goal is to assist users who are having trouble logging in, signing up, or have questions about the app.

// **Your Directives:**

// 1.  **Be Friendly and Welcoming:** Greet the user warmly.
// 2.  **Login Issues:** If a user can't log in, suggest they check their email and password. If they've forgotten their password, guide them to click the "Forgot your password?" link.
// 3.  **Signup Issues:** If a user is having trouble signing up, explain the process: fill in the details, choose a role (Patient or Doctor), and click "Create an account."
// 4.  **App Features:** If asked what HealthSphere is, briefly explain its key features: connecting with doctors, AI health tools (like skin analysis and medicine checking), and managing appointments.
// 5.  **Keep it Concise:** Provide short, clear, and helpful answers. Do not make up information.
// 6.  **Ethical Boundaries:** You are an assistant for the login page. Do not provide medical advice or any information outside the scope of helping with login, signup, or basic app features.

// **Current Conversation:**

// {{#each chatHistory}}
// **{{role}}:** {{{content}}}
// {{/each}}

// Based on the conversation, provide the next helpful response as the model.
// `,
// });

// const psychologistChatFlow = ai.defineFlow(
//   {
//     name: 'loginAssistantChatFlow',
//     inputSchema: LoginAssistantChatInputSchema,
//     outputSchema: LoginAssistantChatOutputSchema,
//   },
//   async input => {
//     const {output} = await prompt(input);
//     return output!;
//   }
// );
'use server';

/**
 * @fileOverview An AI assistant for the login page to help users.
 *
 * - getLoginAssistantResponse - A function that handles the chat conversation.
 * - LoginAssistantChatInput - The input type for the getLoginAssistantResponse function.
 * - LoginAssistantChatOutput - The return type for the getLoginAssistantResponse function.
 * - ChatMessage - A type representing a single message in the chat history.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatMessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const LoginAssistantChatInputSchema = z.object({
    chatHistory: z.array(ChatMessageSchema).describe('The history of the conversation so far.'),
});
export type LoginAssistantChatInput = z.infer<typeof LoginAssistantChatInputSchema>;

const LoginAssistantChatOutputSchema = z.object({
    response: z.string().describe("The AI's response to the user."),
});
export type LoginAssistantChatOutput = z.infer<typeof LoginAssistantChatOutputSchema>;


export async function getLoginAssistantResponse(input: LoginAssistantChatInput): Promise<LoginAssistantChatOutput> {
    // Calling the correctly named flow variable
    return loginAssistantChatFlow(input); 
}

const prompt = ai.definePrompt({
    name: 'loginAssistantChatPrompt',
    input: {schema: LoginAssistantChatInputSchema},
    output: {schema: LoginAssistantChatOutputSchema},
    prompt: `You are a helpful and friendly AI assistant for the HealthSphere application's login page. Your goal is to assist users who are having trouble logging in, signing up, or have questions about the app.

**Your Directives:**

1.  **Be Friendly and Welcoming:** Greet the user warmly.
2.  **Login Issues:** If a user can't log in, suggest they check their email and password. If they've forgotten their password, guide them to click the "Forgot your password?" link.
3.  **Signup Issues:** If a user is having trouble signing up, explain the process: fill in the details, choose a role (Patient or Doctor), and click "Create an account."
4.  **App Features:** If asked what HealthSphere is, briefly explain its key features: connecting with doctors, AI health tools (like skin analysis and medicine checking), and managing appointments.
5.  **Keep it Concise:** Provide short, clear, and helpful answers. Do not make up information.
6.  **Ethical Boundaries:** You are an assistant for the login page. Do not provide medical advice or any information outside the scope of helping with login, signup, or basic app features.

**Current Conversation:**

{{#each chatHistory}}
**{{role}}:** {{{content}}}
{{/each}}

Based on the conversation, provide the next helpful response as the model.
`,
});

// RENAMED: Used a consistent and correct variable name here
const loginAssistantChatFlow = ai.defineFlow(
    {
        name: 'loginAssistantChatFlow',
        inputSchema: LoginAssistantChatInputSchema,
        outputSchema: LoginAssistantChatOutputSchema,
    },
    async input => {
        const {output} = await prompt(input);
        return output!;
    }
);
