'use server';

/**
 * @fileOverview An AI assistant for the login page to help users.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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

export async function getLoginAssistantResponse(
    input: LoginAssistantChatInput
): Promise<LoginAssistantChatOutput> {
    return loginAssistantChatFlow(input);
}

const prompt = ai.definePrompt({
    name: 'loginAssistantChatPrompt',
    input: { schema: LoginAssistantChatInputSchema },
    output: { schema: LoginAssistantChatOutputSchema },
    prompt: `
You are a helpful and friendly AI assistant for the HealthSphere application's login page. 

{{#each chatHistory}}
**{{role}}:** {{{content}}}
{{/each}}

Provide the next helpful response.
`,
});

const loginAssistantChatFlow = ai.defineFlow(
    {
        name: 'loginAssistantChatFlow',
        inputSchema: LoginAssistantChatInputSchema,
        outputSchema: LoginAssistantChatOutputSchema,
    },
    async input => {
        const { output } = await prompt(input);
        return output!;
    }
);
